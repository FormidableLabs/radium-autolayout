/* eslint-env browser */
const DEFAULT_THREAD_COUNT = 4;
const Solver = require("worker-loader!./engine.worker");

export default class WorkerPool {
  constructor(threadCount) {
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
      const worker = new Solver();
      worker.onmessage = (event) => this.onMessage(event);
      this.workers.push(worker);
    }
  }

  registerView(viewName, callback) {
    if (this.views[viewName]) {
      return;
    }

    const workerId = this.currentWorker % this.workers.length;
    const worker = this.workers[workerId];

    this.views[viewName] = { workerId, callback };
    worker.postMessage({
      type: "registerView",
      payload: { viewName }
    });

    // Allow the next worker to accept work
    this.currentWorker++;
  }

  deregisterView(viewName) {
    if (!this.views[viewName]) {
      return;
    }

    const worker = this.workers[this.views[viewName]];
    worker.postMessage({
      type: "deregisterView",
      payload: { viewName }
    });
    this.views[viewName] = null;
  }

  routeMessage(message) {
    const { viewName } = message.payload;
    if (viewName && this.views[viewName]) {
      const workerId = this.views[viewName].workerId;
      const worker = this.workers[workerId];
      worker.postMessage(message);
    }
  }

  onMessage(event) {
    const { viewName } = event.payload;
    if (viewName) {
      this.views[viewName].callback(event);
    }
  }
}

