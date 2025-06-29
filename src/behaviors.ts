// deno-lint-ignore-file no-explicit-any

import { Kernel } from "./kernel.ts";

export type BehaviorType<K> = {
  name: string;
  requires: string[];
  pattern: (kernel: Kernel, ...args: any[]) => K;
}

export class Behavior<K> {
  constructor(
    public name: string,
    public requires: string[],
    private kernel: Kernel,
    private pattern: (kernel: Kernel, ...args: any[]) => K
  ) {}

  execPattern(...args: any[]): K {
    return this.pattern(this.kernel, ...args);
  }
}