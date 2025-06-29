// deno-lint-ignore-file ban-types

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
      method: (func: Function) => {
        console.log(`Running benchmark on function ${func.name}:`);
        const start = performance.now();
        func();
        const end = performance.now();
        const duration = end - start;
        console.log(`Benchmark on function ${func.name} completed in ${duration} ms`);
        return { duration };
      },
    },
  ],
}