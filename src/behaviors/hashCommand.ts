// deno-lint-ignore-file no-explicit-any

import { BehaviorType } from "../behaviors.ts";
import { Kernel } from "../kernel.ts";

/**
  * Behavior that executes a command in the format module.
  * It requires the "format" module to be available in the kernel.
  * The command is executed with the provided arguments.
  */
export const behavior: BehaviorType<void> = {
  name: "hashCommand",
  requires: ["hash"],
  pattern: (kernel: Kernel, command: string, ...args: any[]): void => {
    const hashModule = kernel.getModule("hash");
    if (!hashModule) {
      throw new Error("Hash module not found");
    }

    if (!hashModule.hasMethod(command)) {
      throw new Error(`Command ${command} not found in hash module`);
    }

    const method = hashModule.getMethod(command);
    if (!method) {
      throw new Error(`Method ${command} not found in hash module`);
    }

    return method.method(...args);
  },
};