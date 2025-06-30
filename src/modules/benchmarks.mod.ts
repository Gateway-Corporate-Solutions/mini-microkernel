// deno-lint-ignore-file no-explicit-any

import { ModuleType } from "../module.ts";

export const mod: ModuleType = {
  name: "benchmarks",
  init: () => {
    console.log("Benchmarks module initialized");
  },
  methods: [
    {
      name: "runBenchmark",
      returns: typeof Number,
      method: (func: (...args: any[]) => any, args: any[]) => {
        console.log(`Running benchmark on function ${func.name}:`);
        const start = performance.now();
        func(...args);
        const end = performance.now();
        const duration = end - start;
        console.log(`Benchmark on function completed in ${duration}s`);
        return duration;
      },
    },
  ],
}