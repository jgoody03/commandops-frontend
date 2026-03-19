import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export function createCallable<Req, Res>(name: string) {
  const fn = httpsCallable<Req, Res>(functions, name);

  return async (payload: Req): Promise<Res> => {
    const result = await fn(payload);
    return result.data;
  };
}

type CallableInvoker<Req, Res> = Req extends void
  ? () => Promise<Res>
  : (payload: Req) => Promise<Res>;

export function callFunction<Req = void, Res = unknown>(
  name: string
): CallableInvoker<Req, Res> {
  const fn = httpsCallable<Req, Res>(functions, name);

  return ((payload?: Req) => fn(payload as Req).then((result) => result.data)) as CallableInvoker<
    Req,
    Res
  >;
}