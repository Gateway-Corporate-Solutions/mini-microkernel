import { ModuleType } from "../module.ts";

/**
  * Module that provides hashing functionality using the Web Crypto API.
  * It includes a method to hash strings using SHA-256.
  */
export const mod: ModuleType = {
  name: "hash",
  init: () => {
    console.log("Hash module initialized");
  },
  methods: [
    {
      name: "hashString",
      returns: typeof String,
      method: (input: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        return crypto.subtle.digest("SHA-256", data).then((hashBuffer) => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        });
      },
    },
  ],
};