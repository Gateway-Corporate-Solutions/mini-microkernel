import { Kernel } from "./src/kernel.ts";
import { Module } from "./src/module.ts";
import { Behavior } from "./src/behaviors.ts";
import { Application, Router } from "oak";

const pick = <Target, KeysToPick extends keyof Target>(
  targetObj: Target,
  keys: KeysToPick[]
) => keys.reduce((acc, key) => ({ ...acc, [key]: targetObj[key] }), {})

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
        const mod = new Module(module.name, module.init, module.methods);
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

  const app = new Application();
  const router = new Router();
  router.get("/", (context) => {
    context.response.body = Deno.readTextFileSync("./static/index.html");
  });
  router.get("/wss", async (context) => {
    if (!context.isUpgradable) {
      context.response.status = 426; // Upgrade Required
      context.response.body = 'Upgrade Required';
      return;
    }
    const socket = await context.upgrade();
    socket.onopen = () => {
      const modules = JSON.stringify({
        type: "modules",
        modules: kernel.getModules().map((m) => ({
          name: m.name,
          methods: m.getMethods().map((method) => ({
            name: method.name,
            returns: method.returns.name,
          })),
        })),
      })
      socket.send(modules);

      const url = `https://dummyjson.com/users/${Math.floor(Math.random() * 100)}`;
      const json = kernel.execBehavior("getJSON", url);
      if (json) {
        json.then((result: any) => {
          socket.send(JSON.stringify({
            type: "json",
            data: {
              url: url,
              ...pick(result, ["id", "firstName", "lastName", "email", "bank"])
            },
          }));
        }).catch((error: Error) => {
          console.error("Error fetching JSON data:", error);
        });
      }
    }
  })
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(async (context, next) => {
    const root = "./static";
    try {
      await context.send({ root });
    } catch {
      next();
    }
  });
  app.listen({ port: 8000 });
  console.log("Server is running on http://localhost:8000");
}

main();