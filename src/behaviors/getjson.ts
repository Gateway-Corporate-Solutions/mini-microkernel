import { Kernel } from "../kernel.ts";
import { BehaviorType } from "../behaviors.ts";

export const behavior: BehaviorType<JSON | undefined> = {
  name: "getJSON",
  requires: ["http/requests"],
  pattern: getJSON,
}

function getJSON(kernel: Kernel, url: string): JSON | undefined {
  try {
    const data = kernel.getModule("http/requests")?.callMethod<JSON>(
      "fetchJSON",
      url,
    )
    if (data) {
      return data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(`Error fetching JSON from ${url}:`, error);
    return undefined;
  }
}