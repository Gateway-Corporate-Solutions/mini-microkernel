import { ModuleType } from "../module.ts";

/**
  * Module that provides functionality to format JSON strings.
  * It includes a method to prettify JSON strings by adding indentation.
  */
export const mod: ModuleType = {
  name: "format",
  init: () => {
    console.log("Format module initialized");
  },
  methods: [
    {
      name: "prettify",
      returns: typeof String,
      method: (jsonString: string): string => {
        try {
          const jsonObject = JSON.parse(jsonString);
          return JSON.stringify(jsonObject, null, 2); // Pretty print JSON
        } catch {
          console.error("Invalid JSON string provided for prettification.");
          return jsonString; // Return original string if parsing fails
        }
      },
    },
  ],
};