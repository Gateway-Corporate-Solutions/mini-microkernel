// deno-lint-ignore-file no-explicit-any

import { BehaviorType } from "../behaviors.ts";
import { Kernel } from "../kernel.ts";

/**
  * Behavior that executes a command in the editor module.
  * It requires the "editor" module to be available in the kernel.
  * The command is executed with the provided arguments.
  */
export const behavior: BehaviorType<void> = {
  name: "editorCommand",
  requires: ["editor"],
  pattern: (kernel: Kernel, command: string, ...args: any[]): void => {
    const editorModule = kernel.getModule("editor");
    if (!editorModule) {
      throw new Error("Editor module not found");
    }

    if (!editorModule.hasMethod(command)) {
      throw new Error(`Command ${command} not found in editor module`);
    }

    const method = editorModule.getMethod(command);
    if (!method) {
      throw new Error(`Method ${command} not found in editor module`);
    }

    return method.method(...args);
  }
}