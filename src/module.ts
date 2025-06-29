import { Kernel } from "./kernel.ts";

export type ModuleMethod<K> = (
  ...args: any[]
) => K;

export type MethodType = {
  name: string;
  method: ModuleMethod<any>;
}

export type ModuleType = {
  name: string;
  init: () => void;
  methods: MethodType[];
}

export class Module {
  constructor(
    public name: string, 
    private init: () => void, 
    private methods: MethodType[] = []
  ) {
    this.init();
  }

  getMethods(): MethodType[] {
    return this.methods;
  }

  callMethod<K>(methodName: string, ...args: any[]): K {
    const method = this.methods.find(m => m.name === methodName);
    if (!method) {
      throw new Error(`Method ${methodName} not found in module ${this.name}`);
    }
    return method.method(...args) as K;
  }

  hasMethod(methodName: string): boolean {
    return this.methods.some(m => m.name === methodName);
  }
}