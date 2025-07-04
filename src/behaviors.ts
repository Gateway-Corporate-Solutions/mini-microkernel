// deno-lint-ignore-file no-explicit-any

import { Kernel } from "./kernel.ts";

export type BehaviorType<K> = {
  name: string;
  requires: string[];
  pattern: (kernel: Kernel, ...args: any[]) => K;
}

/**
  * Behavior class that represents a behavior in the microkernel system.
  * It includes the behavior name, required modules, and a pattern function that defines the behavior's logic.
  */
export class Behavior<K> {
  constructor(
    public name: string,
    public requires: string[],
    private kernel: Kernel,
    private pattern: (kernel: Kernel, ...args: any[]) => K
  ) {}

  /**
    * Executes the behavior's pattern function with the provided arguments.
    * It uses the kernel instance to access modules and other behaviors.
    * @param args - Arguments to pass to the pattern function.
    * @returns The result of the pattern function execution.
    */
  execPattern(...args: any[]): K {
    return this.pattern(this.kernel, ...args);
  }
}