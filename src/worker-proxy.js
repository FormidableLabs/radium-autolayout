// @flow
export type Proxyable = {
  constructor(worker: Worker): void;
  run(method: string, args: Object, cb: (result: ?Cloneable) => void): void;
  terminate(): void;
};

export default class WorkerProxy {
  worker: Worker;
  callbacks: { [key: string]: (result: ?Cloneable) => void };

  constructor(worker: Worker) {
    this.worker = worker;
    this.callbacks = {};
    this.worker.onmessage = ({ data: message }) => {
      const method = message.method || null;
      if (method) {
        const cb = this.callbacks[method];
        if (cb) {
          cb(message.result || null);
          this.callbacks[method] = null;
        }
      }
    };
  }

  run(method: string, args: Object, cb: (result: ?Cloneable) => void) {
    this.callbacks[method] = cb;
    this.worker.postMessage({ method, args });
  }

  terminate() {
    this.worker.terminate();
  }
}
