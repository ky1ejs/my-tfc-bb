import { sendUnaryData } from "@grpc/grpc-js";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { MyTfcBbError } from "./MyTfcBbError";

export function handleError<T>(error: Error, callback: sendUnaryData<T>) {
  console.log(`Error: ${error.message}`);

  if (error instanceof MyTfcBbError) {
    callback({ code: error.grpcStatus(), message: error.message });
    return;
  }

  callback({ code: Status.INTERNAL });
}
