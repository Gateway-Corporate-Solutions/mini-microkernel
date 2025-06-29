import { ModuleType } from "../module.ts";

export const mod: ModuleType = {
  name: "stringutils",
  init: () => {
    console.log("String Utils module initialized");
  },
  methods: [
    {
      name: "toUpperCase",
      returns: typeof String,
      method: (input: string) => {
        console.log(`Converting to uppercase: ${input}`);
        return input.toUpperCase();
      },
    },
    {
      name: "toLowerCase",
      returns: typeof String,
      method: (input: string) => {
        console.log(`Converting to lowercase: ${input}`);
        return input.toLowerCase();
      },
    },
    {
      name: "capitalize",
      returns: typeof String,
      method: (input: string) => {
        console.log(`Capitalizing string: ${input}`);
        return input.charAt(0).toUpperCase() + input.slice(1);
      },
    },
  ],
}