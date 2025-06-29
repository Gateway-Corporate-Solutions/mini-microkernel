import { ModuleType } from "../module.ts";

export const mod: ModuleType = {
  name: "fileutils",
  init: () => {
    console.log("FileUtils module initialized");
  },
  methods: [
    {
      name: "readFile",
      returns: typeof String,
      method: async (filePath: string): Promise<string> => {
        const data = await Deno.readTextFile(filePath);
        return data;
      },
    },
    {
      name: "writeFile",
      returns: typeof void 0,
      method: async (filePath: string, content: string): Promise<void> => {
        await Deno.writeTextFile(filePath, content);
      },
    },
    {
      name: "deleteFile",
      returns: typeof void 0,
      method: async (filePath: string): Promise<void> => {
        await Deno.remove(filePath);
      },
    },
  ]
};