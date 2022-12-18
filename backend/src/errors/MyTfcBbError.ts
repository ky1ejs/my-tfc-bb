import { Status } from "@grpc/grpc-js/build/src/constants";
import { GrpcError } from "./GrpcError";

export enum MyTfcBbErrorType {
  UNAUTHENTICATED,
  BAD_REQUEST,
}

export class MyTfcBbError extends GrpcError {
  type: MyTfcBbErrorType;

  constructor(type: MyTfcBbErrorType) {
    switch (type) {
      case MyTfcBbErrorType.UNAUTHENTICATED:
        super(Status.UNAUTHENTICATED, "Request is unauthenticated.");
        break;
      case MyTfcBbErrorType.BAD_REQUEST:
        super(Status.INVALID_ARGUMENT, "Request is bad, m'kay.");
        break;
      default:
        throw new Error("Unknown MyTfcBbErrorType passed in at construction");
    }
    this.type = type;
  }

  static unauthenticated(): MyTfcBbError {
    return new MyTfcBbError(MyTfcBbErrorType.UNAUTHENTICATED);
  }

  static badRequest(): MyTfcBbError {
    return new MyTfcBbError(MyTfcBbErrorType.BAD_REQUEST);
  }
}
