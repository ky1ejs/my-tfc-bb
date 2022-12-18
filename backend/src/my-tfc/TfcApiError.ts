import { Status } from "@grpc/grpc-js/build/src/constants";
import { GrpcError } from "../errors/GrpcError";

export enum TfcApiErrorType {
  BAD_GATEWAY,
  INVALID_PASSWORD,
}

export class TfcApiError extends GrpcError {
  type: TfcApiErrorType;

  constructor(type: TfcApiErrorType) {
    switch (type) {
      case TfcApiErrorType.BAD_GATEWAY:
        super(Status.INTERNAL, "502 from TFC API.");
        break;
      case TfcApiErrorType.INVALID_PASSWORD:
        super(Status.UNAUTHENTICATED, "User's password is invalid");
        break;
      default:
        throw new Error("Unknown TfcApiErrorType passed in at construction");
    }
    this.type = type;
  }

  static invalidPassword(): TfcApiError {
    return new TfcApiError(TfcApiErrorType.INVALID_PASSWORD);
  }

  static badGateway(): TfcApiError {
    return new TfcApiError(TfcApiErrorType.BAD_GATEWAY);
  }
}
