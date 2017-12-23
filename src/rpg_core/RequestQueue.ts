export default class RequestQueue {
  protected _queue: any[] = [];

  public enqueue(key: string, value: any) {
    this._queue.push({ key, value });
  }

  public update(): void | undefined {
    if (this._queue.length === 0) {
      return;
    }

    const top = this._queue[0];
    if (top.value.isRequestReady()) {
      this._queue.shift();
      if (this._queue.length !== 0) {
        this._queue[0].value.startRequest();
      }
    } else {
      top.value.startRequest();
    }
  }

  public raisePriority(key: string): void {
    for (let n = 0; n < this._queue.length; n++) {
      const item = this._queue[n];
      if (item.key === key) {
        this._queue.splice(n, 1);
        this._queue.unshift(item);
        break;
      }
    }
  }

  public clear(): void {
    this._queue.splice(0);
  }
}
