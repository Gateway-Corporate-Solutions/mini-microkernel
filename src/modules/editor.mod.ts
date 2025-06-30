import { ModuleType } from "../module.ts";

export const mod: ModuleType = {
  name: "editor",
  init: () => {
    console.log("Editor module initialized");
  },
  methods: [
    {
      name: "openFile",
      returns: typeof String,
      method: async (filePath: string): Promise<string> => {
        const data = await Deno.readTextFile(filePath);
        return data;
      },
    },
    {
      name: "saveFile",
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
}
