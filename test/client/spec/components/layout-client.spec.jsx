/* eslint-disable no-magic-numbers */
import LayoutClient from "src/layout-client";

class MockWorker {
  constructor() {}
  postMessage() {}
  terminate() {}
}

class MockProxy {
  worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;
  }

  run() {}

  terminate() {
    this.worker.terminate();
  }
}

describe("Layout client", () => {
  it("should initialize a views dict and the correct # of workers", () => {
    const client = new LayoutClient(4, MockProxy, MockWorker);
    expect(client).to.have.property("views");
    const workers = client.workers;
    expect(workers.length).to.equal(4);
  });

  it("should register a view and cycle to the next worker", () => {
    const client = new LayoutClient(4, MockProxy, MockWorker);
    const size = {
      width: 10,
      height: 5
    };
    const spacing = [0];
    client.registerView("testView", size, spacing, () => "won't fire");

    const view = client.views.testView;
    expect(view.workerId).to.equal(0);
    expect(view.callback).to.be.a("function");
    expect(client).to.have.deep.property("currentWorker", 1);
  });

  it("should deregister a view", () => {
    const client = new LayoutClient(4, MockProxy, MockWorker);
    const size = {
      width: 10,
      height: 5
    };
    const spacing = [0];
    client.registerView("testView", size, spacing, () => "won't fire");
    client.deregisterView("testView");
    expect(client).to.have.deep.property("views.testView", null);
  });

  it("should terminate all workers", () => {
    const client = new LayoutClient(4, MockProxy, MockWorker);
    const size = {
      width: 10,
      height: 5
    };
    const spacing = [0];
    client.registerView("testView", size, spacing, () => "won't fire");
    client.deregisterView("testView");
    client.terminate();

    expect(client.currentWorker).to.equal(0);
    expect(client.workers.length).to.equal(0);
  });
});

