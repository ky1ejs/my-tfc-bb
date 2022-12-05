import { ServerUnaryCall } from "@grpc/grpc-js";

export function logRequest<T, V>(
  call: ServerUnaryCall<T, V>
): Promise<ServerUnaryCall<T, V>> {
  console.log("Time:", Date.now());
  console.log(call.getPath());
  console.log("----");
  return Promise.resolve(call);
}
