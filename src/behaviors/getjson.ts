import { Kernel } from "../kernel.ts";
import { BehaviorType } from "../behaviors.ts";

export const behavior: BehaviorType<object | undefined> = {
  name: "getJSON",
  requires: ["http/requests"],
  pattern: getJSON,
}

function getJSON(kernel: Kernel, url: string): object | undefined {
  try {
    const data = kernel.getModule("http/requests")?.callMethod<object>(
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