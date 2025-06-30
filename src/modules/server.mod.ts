// deno-lint-ignore-file no-explicit-any

import { ModuleType } from "../module.ts";
import { Kernel } from "../kernel.ts";
import { Application, Router } from "oak";

const pick = <Target, KeysToPick extends keyof Target>(
  targetObj: Target,
  keys: KeysToPick[]
) => keys.reduce((acc, key) => ({ ...acc, [key]: targetObj[key] }), {})

export const mod: ModuleType = {
  name: "http-server",
  init: (kernel: Kernel) => {
    const app = new Application();
    const router = new Router();
    router.get("/", (context) => {
      context.response.body = Deno.readTextFileSync("./static/index.html");
    });
    router.get("/wss", async (context) => {
      if (!context.isUpgradable) {
        context.response.status = 426; // Upgrade Required
        context.response.body = "Upgrade Required";
        return;
      }
      const socket = await context.upgrade();
      socket.onopen = () => {
        const modules = JSON.stringify({
          type: "modules",
          modules: kernel.getModules().map((m) => ({
            name: m.name,
            methods: m.getMethods ? m.getMethods()!.map((method) => ({
              name: method.name,
              returns: method.returns.name,
            })) : [],
          })),
        });
        socket.send(modules);

        const url = `https://dummyjson.com/users/${
          Math.floor(Math.random() * 100)
        }`;
        const json = kernel.execBehavior("getJSON", url);
        if (json) {
          json.then((result: any) => {
            socket.send(JSON.stringify({
              type: "json",
              data: {
                url: url,
                ...pick(result, ["firstName", "lastName", "email", "bank"]),
              },
            }));
          }).catch((error: Error) => {
            console.error("Error fetching JSON data:", error);
          });
        }
      };
    });
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
};
