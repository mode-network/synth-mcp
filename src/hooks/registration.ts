import { BeforeRequestHook, HookContext, Hooks } from "./types.js";

/*
 * This file is only ever generated once on the first generation and then is free to be modified.
 * Any hooks you wish to add should be registered in the initHooks function. Feel free to define them
 * in this file or in separate files in the hooks folder.
 */

class BearerAuthHook implements BeforeRequestHook {
  beforeRequest(_: HookContext, request: Request) {
    const authz = request.headers.get("Authorization");
    if (authz) {
      return request;
    }

    let token = "";
    if (typeof process !== "undefined") {
      token = process.env["API_KEY"] ?? "";
    }

    if (!token) {
      throw new Error(
        "The API_KEY environment variable is missing or empty; either provide it",
      );
    }

    request.headers.set("Authorization", `Apikey ${token}`);

    return request;
  }
}

export function initHooks(hooks: Hooks) {
  // Add hooks by calling hooks.register{ClientInit/BeforeCreateRequest/BeforeRequest/AfterSuccess/AfterError}Hook
  // with an instance of a hook that implements that specific Hook interface
  // Hooks are registered per SDK instance, and are valid for the lifetime of the SDK instance
  const bearerAuthHook = new BearerAuthHook();
  hooks.registerBeforeRequestHook(bearerAuthHook);
}
