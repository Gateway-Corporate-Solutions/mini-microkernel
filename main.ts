import { Kernel } from "./src/kernel.ts";
import { Module } from "./src/module.ts";
import { Application, Router } from "oak";

const kernel = new Kernel();
const modulesPath = "./src/modules";

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

async function main() {
  console.log("Starting kernel...");
  await loadModules(modulesPath);
  console.log(
    "Kernel started with modules:",
    kernel.getModules().map((m) => m.name),
  );

  if (kernel.hasModule("http/requests")) {
    const testModule = kernel.getModule("http/requests") as Module;
    console.log(`Invoking methods for module: ${testModule.name}`);
    try {
      const result = await testModule.callMethod<JSON>(
        "fetchJSON",
        "https://dummyjson.com/users/1",
      );
      console.log("Result from fetchJSON:", result);
    } catch (error) {
      console.error(`Error invoking method fetchJSON:`, error);
    }
  }

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
      const data = JSON.stringify({
        type: "modules",
        modules: kernel.getModules().map((m) => ({
          name: m.name,
          methods: m.getMethods().map((method) => ({
            name: method.name,
            returns: method.returns.name,
          })),
        })),
      })
      socket.send(data);
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
