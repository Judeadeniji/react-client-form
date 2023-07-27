 type Action = Promise<ActionTypes>

export type AvailableMethods = | "GET" | "POST" | "PUT" | "PATCH" | "DELETE" 

export type ActionTypes = {
  GET?: (request: Request) => (any | Promise<any>)
  POST?: (request: Request) => (any | Promise<any>)
  PUT?: (request: Request) => (any | Promise<any>)
  PATCH?: (request: Request) => (any | Promise<any>)
  DELETE?: (request: Request) => (any | Promise<any>)
  default: (request: Request) => (any | Promise<void>)
}

export type Resolve = {
  module: () => Action
  path: string
}

export async function submitForm(target: HTMLFormElement, method: AvailableMethods, action: Resolve, type: string): Promise<void> {
  const formdata = new FormData(target);
  const actions = await action.module();
  const _method = matchMethod(method, actions);
  if(typeof _method != "function") return;
  
  await _method(new Request(action.path, { method: method, body: formdata }));
  
  if (type == "reset") target.reset();
}

function matchMethod(method: AvailableMethods, actions: ActionTypes): Function {
  return actions[method] || actions["default"];
}

export function resolve(localPath: string): Resolve {
  return {
    module: () => void 0,
    path: localPath
  }
}