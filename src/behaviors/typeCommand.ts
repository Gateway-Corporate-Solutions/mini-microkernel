// deno-lint-ignore-file no-explicit-any

import { BehaviorType } from "../behaviors.ts";
import { Kernel } from "../kernel.ts";

export const behavior: BehaviorType<void> = {
  name: "typeCommand",
  requires: ["typeutils"],
  pattern: (kernel: Kernel, command: string, ...args: any[]): void => {
    const typeutilsModule = kernel.getModule("typeutils");
    if (!typeutilsModule) {
      throw new Error("Typeutils module not found");
    }

    if (!typeutilsModule.hasMethod(command)) {
      throw new Error(`Command ${command} not found in typeutils module`);
    }

    const method = typeutilsModule.getMethod(command);
    if (!method) {
      throw new Error(`Method ${command} not found in typeutils module`);
    }

    return method.method(...args);
  },
};