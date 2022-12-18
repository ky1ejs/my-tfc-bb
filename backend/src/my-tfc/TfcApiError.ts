export enum TfcApiErrorType {
  BAD_GATEWAY,
  INVALID_PASSWORD,
}

export class TfcApiError extends Error {
  type: TfcApiErrorType;

  constructor(type: TfcApiErrorType) {
    switch (type) {
      case TfcApiErrorType.BAD_GATEWAY:
        super("502 from TFC API.");
        break;
      case TfcApiErrorType.INVALID_PASSWORD:
        super("User's password is invalid");
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
