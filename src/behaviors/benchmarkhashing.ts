// deno-lint-ignore-file ban-types

import { BehaviorType } from "../behaviors.ts";
import { Kernel } from "../kernel.ts";

export const behavior: BehaviorType<number> = {
  name: "benchmarkHashing",
  requires: ["hash", "benchmarks"],
  pattern: benchmarkHashing,
};

function benchmarkHashing(kernel: Kernel): number {
  try {
    const hashingModule = kernel.getModule("hash");
    const benchmarksModule = kernel.getModule("benchmarks");

    if (!hashingModule || !benchmarksModule) {
      throw new Error("Required modules 'hash' or 'benchmarks' not found");
    }

    const data = "The quick brown fox jumps over the lazy dog. ".repeat(1000);
    const hashFunction = hashingModule.getMethod("hashString")?.method;
      
    if (typeof hashFunction !== "function") {
      throw new Error("Hash function not found in 'hashing' module");
    }

    const benchmarkResult = benchmarksModule.callMethod<number>("runBenchmark", hashFunction, [data]);
      
    return benchmarkResult;
  } catch (error) {
    console.error("Error in benchmarkHashing:", error);
    return -1; // Return -1 to indicate an error
  }
}