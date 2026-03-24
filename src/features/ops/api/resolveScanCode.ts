import { callFunction } from "@/lib/functions";
import type {
  ResolveScanCodeRequest,
  ResolveScanCodeResponse,
} from "../types";

const resolveScanCodeFn = callFunction<
  ResolveScanCodeRequest,
  ResolveScanCodeResponse
>("resolveScanCode");

export async function resolveScanCode(input: ResolveScanCodeRequest) {
  return resolveScanCodeFn(input);
}