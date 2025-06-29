import { ModuleType } from "../module.ts";

export const mod: ModuleType = {
  name: "http/requests",
  init: () => {
    console.log("Test module initialized");
  },
  methods: [
    {
      name: "fetchJSON",
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
            console.log("Fetched JSON data:", data);
            return data;
          })
          .catch(error => {
            console.error("Error fetching JSON:", error);
            throw error;
          });
        return data;
      },
    },
  ]
};