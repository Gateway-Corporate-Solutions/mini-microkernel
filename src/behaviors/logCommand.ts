// deno-lint-ignore-file no-explicit-any

import { BehaviorType } from "../behaviors.ts";
import { Kernel } from "../kernel.ts";

/**
  * Behavior that executes a command in the format module.
  * It requires the "format" module to be available in the kernel.
  * The command is executed with the provided arguments.
  */
export const behavior: BehaviorType<void> = {
  name: "logCommand",
  requires: ["logs"],
  pattern: (kernel: Kernel, command: string, ...args: any[]): void => {
    const logsModule = kernel.getModule("logs");
    if (!logsModule) {
      throw new Error("Logs module not found");
    }

    if (!logsModule.hasMethod(command)) {
      throw new Error(`Command ${command} not found in logs module`);
    }

    const method = logsModule.getMethod(command);
    if (!method) {
      throw new Error(`Method ${command} not found in logs module`);
    }

    return method.method(...args);
  },
};