import { sendUnaryData } from "@grpc/grpc-js";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { GrpcError } from "./GrpcError";

export function handleError<T>(error: Error, callback: sendUnaryData<T>) {
  console.log(`Error: ${error.message}`);

  if (error instanceof GrpcError) {
    callback({ code: error.grpcStatus, message: error.message });
    return;
  }

  callback({ code: Status.INTERNAL });
}
