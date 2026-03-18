import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export function callFunction<TReq = any, TRes = any>(
  name: string
) {
  return httpsCallable<TReq, TRes>(functions, name);
}