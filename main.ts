import { Kernel } from "./src/kernel.ts";
import { Module } from "./src/module.ts";
import { Behavior } from "./src/behaviors.ts";

const kernel = new Kernel();
const modulesPath = "./src/modules";
const behaviorsPath = "./src/behaviors";

// Dynamically load modules from the modules directory recursively
// This assumes that all module files end with .mod.ts
async function loadModules(path: string): Promise<void> {
  for await (const entry of Deno.readDir(path)) {
    const fullPath = `${path}/${entry.name}`;
    if (entry.isDirectory) {
      await loadModules(fullPath); // Recursively load modules from subdirectories
    } else if (entry.isFile && entry.name.endsWith(".mod.ts")) {
      try {
        // Import the module dynamically
        const module = (await import(fullPath)).mod;
        const mod = new Module(module.name, module.init, [kernel], module.methods);
        kernel.registerModule(mod);
        console.log(`Loaded module: ${mod.name}`);
      } catch (error) {
        console.error(`Failed to load module from ${fullPath}:`, error);
      }
    }
  }
}

// Dynamically load behaviors from the behaviors directory recursively
// This assumes that all behavior files end with .ts
async function loadBehaviors(path: string): Promise<void> {
  for await (const entry of Deno.readDir(path)) {
    const fullPath = `${path}/${entry.name}`;
    if (entry.isDirectory) {
      await loadBehaviors(fullPath); // Recursively load behaviors from subdirectories
    } else if (entry.isFile && entry.name.endsWith(".ts")) {
      try {
        // Import the behavior dynamically
        const behaviorModule = (await import(fullPath)).behavior;
        const behavior = new Behavior(
          behaviorModule.name,
          behaviorModule.requires,
          kernel,
          behaviorModule.pattern,
        );
        kernel.registerBehavior(behavior);
        console.log(`Loaded behavior: ${behavior.name}`);
      } catch (error) {
        console.error(`Failed to load behavior from ${fullPath}:`, error);
      }
    }
  }
}

async function main() {
  console.log("Starting kernel...");

  console.log("Registering modules...");
  await loadModules(modulesPath);
  console.log(
    "Kernel started with modules:",
    kernel.getModules().map((m) => m.name),
  );

  console.log("Registering behaviors...");
  await loadBehaviors(behaviorsPath);
  console.log(
    "Behaviors registered:",
    kernel.getBehaviors().map((m) => m.name),
  );
}

main();