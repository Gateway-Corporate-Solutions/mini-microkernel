// deno-lint-ignore-file no-explicit-any

export type ModuleMethod<K> = (
  ...args: any[]
) => K;

export type MethodType<K> = {
  name: string;
  returns: K;
  method: ModuleMethod<any>;
}

export type ModuleType = {
  name: string;
  init: () => void;
  methods: MethodType<any>[];
}

export class Module {
  constructor(
    public name: string, 
    private init: () => void, 
    private methods: MethodType<any>[] = []
  ) {
    this.init();
  }

  getMethods(): MethodType<any>[] {
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