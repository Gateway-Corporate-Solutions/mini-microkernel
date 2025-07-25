// deno-lint-ignore-file no-explicit-any

import { BehaviorType } from "../behaviors.ts";
import { Kernel } from "../kernel.ts";

/**
  * Behavior that executes a command in the format module.
  * It requires the "format" module to be available in the kernel.
  * The command is executed with the provided arguments.
  */
export const behavior: BehaviorType<void> = {
  name: "formatCommand",
  requires: ["format"],
  pattern: (kernel: Kernel, command: string, ...args: any[]): void => {
    const formatModule = kernel.getModule("format");
    if (!formatModule) {
      throw new Error("Format module not found");
    }

    if (!formatModule.hasMethod(command)) {
      throw new Error(`Command ${command} not found in format module`);
    }

    const method = formatModule.getMethod(command);
    if (!method) {
      throw new Error(`Method ${command} not found in format module`);
    }

    return method.method(...args);
  },
};