import { Module } from './module.ts';

export class Kernel {
  constructor(private modules: Module[] = []) {}

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
}