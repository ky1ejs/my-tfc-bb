import { Status } from "@grpc/grpc-js/build/src/constants";

export class GrpcError extends Error {
  grpcStatus: Status

  constructor(grpcStatus: Status, message: string) {
    super(message);
    this.grpcStatus = grpcStatus
  }
}
