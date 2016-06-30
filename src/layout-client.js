// @flow
/* eslint-env browser */

import type { WorkerArgs } from "./engine";
import type { Proxyable } from "./worker-proxy";
import WorkerProxy from "./worker-proxy";

const DEFAULT_THREAD_COUNT = 4;

const LayoutWorker = () => {
  return new Worker(
    URL.createObjectURL(new Blob(
      [atob("babel-inline-worker!./engine.js")],
      {type: "text/javascript"}
    ))
  );
};

export default class LayoutClient {
  views: { [key: string]: ?{ workerId: number } };
  workers: Array<Proxyable>;
  currentWorker: number;

  constructor(
    threadCount: number,
    workerFactory: () => Worker = LayoutWorker,
    ProxyClass: any = WorkerProxy
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
      const proxy: Proxyable = new ProxyClass(workerFactory());
      this.workers.push(proxy);
    }
  }

  registerView( // eslint-disable-line max-params
    viewName: string,
    size: { width: number, height: number },
    spacing: Array<number>,
    callback: () => void
  ): Promise<any> {
    if (this.views[viewName]) {
      return Promise.reject("View already exists!");
    }

    this.views[viewName] = {
      workerId: this.currentWorker, callback
    };

    const currentWorker = this.currentWorker;

    // Cycle through the worker pool
    if (this.currentWorker === this.workers.length - 1) {
      this.currentWorker = 0;
    } else {
      this.currentWorker++;
    }

    return new Promise((resolve) => {
      this.workers[currentWorker].run("registerView", {
        viewName, size, spacing
      }, resolve);
    });
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

  run(method: string, args: WorkerArgs): Promise<any> {
    const worker = this.workerForView(args.viewName);
    return new Promise((resolve, reject) => {
      if (worker) {
        worker.run(method, args, resolve);
      } else {
        reject("No worker found for this view. Did you register it?");
      }
    });
  }

  terminate() {
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.currentWorker = 0;
  }
}
