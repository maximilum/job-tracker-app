import { describe, it, expect, vi } from "vitest";
import { MutationQueue } from "@/lib/mutationQueue";

describe("MutationQueue", () => {
  it("processes enqueued tasks sequentially", async () => {
    const queue = new MutationQueue();
    const executed: number[] = [];

    await new Promise<void>((resolve) => {
      queue.enqueue(async () => {
        await new Promise((r) => setTimeout(r, 10));
        executed.push(1);
      });

      queue.enqueue(async () => {
        executed.push(2);
        resolve();
      });
    });

    expect(executed).toEqual([1, 2]);
  });

  it("recovers from errors and continues draining subsequent tasks (Bug 2.2)", async () => {
    const onError = vi.fn();
    const queue = new MutationQueue({ onError });
    const executed: number[] = [];

    await new Promise<void>((resolve) => {
      // Failing task
      queue.enqueue(async () => {
        throw new Error("Network connection dropped");
      });

      // Succeeding task that should still run despite previous failure
      queue.enqueue(async () => {
        executed.push(42);
        resolve();
      });
    });

    // Allow drain loop to exit finally block
    await new Promise((r) => setTimeout(r, 5));

    expect(onError).toHaveBeenCalledTimes(1);
    expect(executed).toEqual([42]);
    expect(queue.isRunning).toBe(false);
  });

  it("coalesces pending tasks sharing the same key", async () => {
    const queue = new MutationQueue();
    const executed: string[] = [];

    await new Promise<void>((resolve) => {
      // First task starts running immediately
      queue.enqueue(async () => {
        await new Promise((r) => setTimeout(r, 50));
        executed.push("jobA-v1");
      });

      // While first is running, multiple updates for jobB arrive
      queue.enqueue(
        async () => {
          executed.push("jobB-v1");
        },
        { key: "jobB" },
      );

      queue.enqueue(
        async () => {
          executed.push("jobB-v2");
        },
        { key: "jobB" },
      );

      queue.enqueue(
        async () => {
          executed.push("jobB-v3 (final)");
          resolve();
        },
        { key: "jobB" },
      );
    });

    expect(executed).toEqual(["jobA-v1", "jobB-v3 (final)"]);
  });
});
