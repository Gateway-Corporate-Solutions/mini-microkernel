// deno-lint-ignore-file no-explicit-any

import { Behavior } from "./behaviors.ts";
import { Module } from './module.ts';

export class Kernel {
  constructor(private modules: Module[] = [], private behaviors: Behavior<any>[] = []) {}

  registerModule(module: Module): void {
    this.modules.push(module);
  }

  getModules(): Module[] {
    return this.modules;
  }

  getModule(moduleName: string): Module | undefined {
    return this.modules.find(module => module.name === moduleName);
  }

  hasModule(moduleName: string): boolean {
    return this.modules.some(module => module.name === moduleName);
  }

  registerBehavior(behavior: Behavior<any>): void {
    this.behaviors.push(behavior);
  }

  getBehaviors(): Behavior<any>[] {
    return this.behaviors;
  }

  getBehavior(behaviorName: string): Behavior<any> | undefined {
    return this.behaviors.find(behavior => behavior.name === behaviorName);
  }

  execBehavior<K>(behaviorName: string, ...args: any[]): K | undefined {
    try {
      const behavior = this.behaviors.find(b => b.name === behaviorName);
      if (!behavior) {
        throw new Error(`Behavior '${behaviorName}' not found`);
      }
      if (!behavior.requires.every(req => this.hasModule(req))) {
        throw new Error(`Behavior '${behaviorName}' requires modules: ${behavior.requires.join(', ')}`);
      }
      return behavior.execPattern(...args);
    } catch (error) {
      console.error(`Error executing behavior '${behaviorName}':`, error);
      return undefined;
    }
  }

  hasBehavior(behaviorName: string): boolean {
    return this.behaviors.some(behavior => behavior.name === behaviorName);
  }
}