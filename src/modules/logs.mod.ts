import { ModuleType } from "../module.ts";

/**
  * Module that provides logging functionality for WebSocket connections.
  * It includes methods to log messages, errors, and warnings.
  */
export const mod: ModuleType = {
  name: "logs",
  init: () => {
    console.log("Logs module initialized");
  },
  methods: [
    {
      name: "log",
      returns: typeof void 0,
      method: (socket: WebSocket, message: string) => {
        console.log(`Log: ${message}`);
        socket.send(JSON.stringify({ type: "log", message }));
      },
    },
    {
      name: "error",
      returns: typeof void 0,
      method: (socket: WebSocket, message: string) => {
        console.error(`Error: ${message}`);
        socket.send(JSON.stringify({ type: "error", message }));
      },
    },
    {
      name: "warn",
      returns: typeof void 0,
      method: (socket: WebSocket, message: string) => {
        console.warn(`Warning: ${message}`);
        socket.send(JSON.stringify({ type: "warn", message }));
      },
    },
  ],
};