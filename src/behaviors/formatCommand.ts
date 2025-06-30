// deno-lint-ignore-file no-explicit-any

import { BehaviorType } from "../behaviors.ts";
import { Kernel } from "../kernel.ts";

export const behavior: BehaviorType<void> = {
  name: "formatCommand",
  requires: ["format"],
  pattern: (kernel: Kernel, command: string, ...args: any[]): void => {
    const formatModule = kernel.getModule("format");
    if (!formatModule) {
      throw new Error("Editor module not found");
    }

    if (!formatModule.hasMethod(command)) {
      throw new Error(`Command ${command} not found in editor module`);
    }

    const method = formatModule.getMethod(command);
    if (!method) {
      throw new Error(`Method ${command} not found in editor module`);
    }

    return method.method(...args);
  },
};