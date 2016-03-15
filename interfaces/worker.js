type Cloneable = Object | number | string | Array<Cloneable>;

declare class WorkerEvent extends Event {
  data: Cloneable;
}

type WorkerEventHandler = (event: WorkerEvent) => mixed;

declare class Worker {
  constructor(URL: ?string): void;
  onmessage: WorkerEventHandler;
  postMessage(messsage: Cloneable): void;
  terminate(): void;
}

declare function postMessage(message: Object): void;
