// @flow
/* eslint-env browser */

import type { WorkerArgs } from "./engine";
import type { Proxyable } from "./worker-proxy";
import WorkerProxy from "./worker-proxy";

// $FlowIssue: obviously won't work on Webpack loaders
const LayoutWorker: any = require("worker!./engine.js");

const DEFAULT_THREAD_COUNT = 4;

export default class LayoutClient {
  views: { [key: string]: ?{ workerId: number } };
  workers: Array<Proxyable>;
  currentWorker: number;

  constructor(
    threadCount: number,
    ProxyClass: any = WorkerProxy,
    WorkerClass: any = LayoutWorker
  ) {
    this.views = {};
    this.workers = [];
    this.currentWorker = 0;

    // Number of workers determined by either:
    // - The constructor
    // - The number of cores on the machine
    // - A default fallback
    const cores = navigator.hardwareConcurrency;
    let workerCount = threadCount || cores || DEFAULT_THREAD_COUNT;

    // Instantiate the workers and add listeners to each one
    while (workerCount--) {
      const proxy: Proxyable = new ProxyClass(new WorkerClass());
      this.workers.push(proxy);
    }
  }

  registerView( // eslint-disable-line max-params
    viewName: string,
    size: { width: number, height: number },
    spacing: Array<number>,
    callback: () => void
  ) {
    if (this.views[viewName]) {
      return;
    }

    this.views[viewName] = {
      workerId: this.currentWorker, callback
    };

    this.workers[this.currentWorker].run("registerView", {
      viewName, size, spacing
    }, callback);

    // Cycle through the worker pool
    if (this.currentWorker === this.workers.length - 1) {
      this.currentWorker = 0;
    } else {
      this.currentWorker++;
    }
  }

  deregisterView(viewName: string, callback: () => void) {
    if (!this.views[viewName]) {
      return;
    }

    const worker = this.workerForView(viewName);
    if (worker) {
      worker.run("deregisterView", { viewName }, callback);
      this.views[viewName] = null;
    }
  }

  workerForView(viewName: string): ?Proxyable {
    if (!this.views[viewName]) {
      return null;
    }
    return this.workers[this.views[viewName].workerId];
  }

  run(
    method: string,
    args: WorkerArgs,
    callback: ((result: ?Cloneable) => void)
  ) {
    const worker = this.workerForView(args.viewName);
    if (worker) {
      worker.run(method, args, callback);
    }
  }

  terminate() {
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.currentWorker = 0;
  }
}

