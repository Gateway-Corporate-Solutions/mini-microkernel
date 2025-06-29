import { ModuleType } from "../module.ts";

export const mod: ModuleType = {
  name: "http/requests",
  init: () => {
    console.log("Requests module initialized");
  },
  methods: [
    {
      name: "fetchJSON",
      returns: typeof JSON,
      method: (url: string) => {
        console.log(`Fetching JSON from ${url}`);
        const data = fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            return data;
          })
          .catch(error => {
            throw error;
          });
        return data;
      },
    },
  ]
};