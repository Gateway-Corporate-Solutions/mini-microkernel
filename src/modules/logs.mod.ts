import { ModuleType } from "../module.ts";

export const mod: ModuleType = {
  name: "logs",
  init: () => {
    console.log("Logs module initialized");
  },
  methods: [
    {
      name: "log",
      returns: typeof void 0,
      method: (message: string) => {
        console.log(`Log: ${message}`);
      },
    },
    {
      name: "error",
      returns: typeof void 0,
      method: (message: string) => {
        console.error(`Error: ${message}`);
      },
    },
    {
      name: "warn",
      returns: typeof void 0,
      method: (message: string) => {
        console.warn(`Warning: ${message}`);
      },
    },
  ],
};