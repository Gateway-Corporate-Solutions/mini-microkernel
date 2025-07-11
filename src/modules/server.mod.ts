import { ModuleType } from "../module.ts";
import { Kernel } from "../kernel.ts";
import { Application, Router } from "oak";


/**
  * Module that implements an HTTP server with WebSocket support.
  * It serves static files and handles WebSocket connections for file uploads, formatting, and hashing.
  */
export const mod: ModuleType = {
  name: "http-server",
  init: (kernel: Kernel) => {
    const app = new Application();
    const router = new Router();

    router.get("/", (context) => {
      context.response.body = Deno.readTextFileSync("./index.html");
    });

    router.get("/wss", async (context) => {
      if (!context.isUpgradable) {
        context.response.status = 426; // Upgrade Required
        context.response.body = "Upgrade Required";
        return;
      }
      const socket = await context.upgrade();
      socket.onopen = () => {
        console.log("WebSocket connection established");
        const modules = JSON.stringify({
          type: "modules",
          modules: kernel.getModules().map((m) => ({
            name: m.name,
            methods: m.getMethods
              ? m.getMethods()!.map((method) => ({
                name: method.name,
                returns: method.returns.name,
              }))
              : [],
          })),
        });
        socket.send(modules);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "upload": {
            const { fileName, content } = data;
            const filePath = `./static/${fileName}`;
            kernel.execBehavior<void>("editorCommand", "saveFile", filePath, content);
            const file = kernel.execBehavior<Promise<string>>("editorCommand", "openFile", filePath);
            file?.then((content) => {
              socket.send(JSON.stringify({
                type: "file",
                fileName,
                content,
              }));

              kernel.execBehavior<void>("editorCommand", "deleteFile", filePath);
            });
            break;
          }
          case "format": {
            const { content } = data;
            try {
              const formatted = kernel.execBehavior<string>("formatCommand", "prettify", content);
              socket.send(JSON.stringify({
                type: "formatted",
                content: formatted,
              }));
            } catch (error) {
              kernel.execBehavior<void>("logCommand", "error", socket, "Error formatting content: " + error);
            }
            break;
          }
          case "hash": {
            const { content } = data;
            try {
              const hash = kernel.execBehavior<Promise<string>>("hashCommand", "hashString", content)
              hash?.then((result) => {
                socket.send(JSON.stringify({
                  type: "hash",
                  hash: result
                }));
              })
            } catch (error) {
              kernel.execBehavior<void>("logsCommand", "error", socket, "Error hashing content: " + error);
            }
            break;
          }
        }
      }
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
  },
};
