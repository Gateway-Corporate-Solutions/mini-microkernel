// deno-lint-ignore-file no-explicit-any

import { ModuleType } from "../module.ts";

export const mod: ModuleType = {
  name: "typeutils",
  init: () => {
    console.log("TypeUtils module initialized");
  },
  methods: [
    {
      name: "pick",
      returns: typeof Object,
      method: <Target, KeysToPick extends keyof Target>(
        targetObj: Target,
        keys: KeysToPick[],
      ): Pick<Target, KeysToPick> => {
        return keys.reduce((acc, key) => {
          return { ...acc, [key]: targetObj[key] };
        }, {} as Pick<Target, KeysToPick>);
      },
    },
    {
      name: "omit",
      returns: typeof Object,
      method: <Target, KeysToOmit extends keyof Target>(
        targetObj: Target,
        keys: KeysToOmit[],
      ): Omit<Target, KeysToOmit> => {
        return Object.keys(targetObj as object).reduce((acc, key) => {
          if (!keys.includes(key as KeysToOmit)) {
            (acc as any)[key] = (targetObj as any)[key]; // Type assertion to allow dynamic key assignment
          }
          return acc;
        }, {} as Omit<Target, KeysToOmit>);
      }
    }
  ],
};