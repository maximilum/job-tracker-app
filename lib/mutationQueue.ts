export type MutationTask = () => Promise<unknown>;

export interface EnqueueOptions {
  key?: string; // Identifier (e.g. jobId) to coalesce redundant rapid updates
}

interface QueuedItem {
  key?: string;
  fn: MutationTask;
}

export class MutationQueue {
  private queue: QueuedItem[] = [];
  private running: boolean = false;
  private onError?: (error: unknown, key?: string) => void;

  constructor(options?: { onError?: (error: unknown, key?: string) => void }) {
    this.onError = options?.onError;
  }

  enqueue(fn: MutationTask, options?: EnqueueOptions): void {
    if (options?.key) {
      const existingIdx = this.queue.findIndex(
        (item) => item.key === options.key,
      );
      if (existingIdx !== -1) {
        // Coalesce: update the pending mutation to the latest one
        this.queue[existingIdx] = { key: options.key, fn };
      } else {
        this.queue.push({ key: options.key, fn });
      }
    } else {
      this.queue.push({ fn });
    }

    if (!this.running) {
      void this.drain();
    }
  }

  private async drain(): Promise<void> {
    this.running = true;
    try {
      while (this.queue.length > 0) {
        const item = this.queue.shift();
        if (!item) continue;

        try {
          await item.fn();
        } catch (err) {
          if (this.onError) {
            this.onError(err, item.key);
          } else {
            console.error("Mutation failed in queue:", err);
          }
        }
      }
    } finally {
      this.running = false;
      // If tasks were queued while in the finally block, re-drain
      if (this.queue.length > 0) {
        void this.drain();
      }
    }
  }

  get length(): number {
    return this.queue.length;
  }

  get isRunning(): boolean {
    return this.running;
  }
}

const boardMutationQueue = new MutationQueue();

export default boardMutationQueue;
