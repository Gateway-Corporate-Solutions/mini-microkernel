# Mini Microkernel

A miniature microkernel written in TypeScript to demonstrate plug-in architecture.

To run the code, use `deno task start`.

## Modules

Modules contain methods that are callable by the kernel and an optional initilization function that is run when mounting the module. They are found in the `src/modules` folder and can be unloaded by appending .x or any other exclusion pattern to the filename. Only modules ending in .mod.ts will be loaded by default.

## Behaviors

Behaviors are the built-in way to access methods from modules, and provides additional checks that `Module.callMethod()` does not. Behaviors have a name, a list of modules that are required to run the behavior, and a pattern of execution. They are found in the `src/behaviors` folder and can be unloaded by appending .x or any other exclusion pattern to the filename. Only behaviors ending in .ts will be loaded by default. The method to call a behavior is `Kernel.execBehavior<K>()` where K is the expected return type of the behavior.