// deno-lint-ignore-file no-explicit-any

export type ModuleMethod<K> = (
  ...args: any[]
) => K;


/**
  * Method type that represents a method in a module.
  * It includes the method name, return type, and the method implementation.
  */
export type MethodType<K> = {
  name: string;
  returns: K;
  method: ModuleMethod<any>;
}


/** Module type that represents a module in the microkernel system.
  * It includes the module name, initialization function, optional arguments, and methods.
  * The `init` function is called during module instantiation, and `methods` is an array of methods that the module provides.
  * The `args` array can be used to pass additional parameters to the initialization function.
  * Modules can be found in the modules directory, and they are loaded by the kernel.
  */
export type ModuleType = {
  name: string;
  init: (...args: any[]) => void;
  args?: any[];
  methods?: MethodType<any>[];
}


/** Module class that represents a module in the microkernel system.
  * It contains methods for initialization and method management.
  */
export class Module {
  constructor(
    public name: string, 
    private init: (...args: any[]) => void,
    private args: any[] = [],
    private methods: MethodType<any>[] = []
  ) {
    this.init(...args);
  }

  getMethods(): MethodType<any>[] {
    return this.methods;
  }

  getMethod(methodName: string): MethodType<any> | undefined {
    return this.methods.find(m => m.name === methodName);
  }

  /** Calls a method by its name, passing the provided arguments.
    * @param methodName - The name of the method to call.
    * @param args - Arguments to pass to the method.
    * @template K - The expected return type of the method.
    * @returns The result of the method call.
    * @throws Error if the method is not found in the module.
    * This method allows dynamic invocation of module methods by their name.
    * It checks if the method exists in the module and throws an error if it does not.
    * This code is unsafe and meant to be used in behavior patterns where the method is guaranteed to exist.
    */
  callMethod<K>(methodName: string, ...args: any[]): K {
    const method = this.methods.find(m => m.name === methodName);
    if (!method) {
      throw new Error(`Method ${methodName} not found in module ${this.name}`);
    }
    return method.method(...args);
  }

  hasMethod(methodName: string): boolean {
    return this.methods.some(m => m.name === methodName);
  }
}