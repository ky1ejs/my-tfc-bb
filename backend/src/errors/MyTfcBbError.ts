import { Status } from "@grpc/grpc-js/build/src/constants";

export enum MyTfcBbErrorType {
  UNAUTHENTICATED,
  BAD_REQUEST,
}

export class MyTfcBbError extends Error {
  type: MyTfcBbErrorType;

  constructor(type: MyTfcBbErrorType) {
    switch (type) {
      case MyTfcBbErrorType.UNAUTHENTICATED:
        super("Request is unauthenticated.");
        break;
      case MyTfcBbErrorType.BAD_REQUEST:
        super("Request is bad, m'kay.");
        break;
      default:
        throw new Error("Unknown MyTfcBbErrorType passed in at construction");
    }
    this.type = type;
  }

  grpcStatus(): Status {
    switch (this.type) {
      case MyTfcBbErrorType.UNAUTHENTICATED:
        return Status.UNAUTHENTICATED;
      case MyTfcBbErrorType.BAD_REQUEST:
        return Status.INVALID_ARGUMENT;
    }
  }

  static unauthenticated(): MyTfcBbError {
    return new MyTfcBbError(MyTfcBbErrorType.UNAUTHENTICATED);
  }

  static badRequest(): MyTfcBbError {
    return new MyTfcBbError(MyTfcBbErrorType.UNAUTHENTICATED);
  }
}
