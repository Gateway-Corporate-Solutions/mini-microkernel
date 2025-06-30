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
  ],
};