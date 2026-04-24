class mutationQueue {
  private queue: (() => Promise<void>)[] = [];
  private running: boolean = false;

  enqueue(fn: () => Promise<void>) {
    this.queue.push(fn);
    if (!this.running) this.drain();
  }

  private async drain() {
    this.running = true;
    while (this.queue.length > 0) {
      await this.queue.shift()!();
    }
    this.running = false;
  }
}

const boardMutationQueue = new mutationQueue();

export default boardMutationQueue;
