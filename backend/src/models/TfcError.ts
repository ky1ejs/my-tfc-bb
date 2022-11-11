export enum TfcErrorType {
  BAD_GATEWAY,
}

export class TfcError extends Error {
  type: TfcErrorType;

  constructor(type: TfcErrorType) {
    switch (type) {
      case TfcErrorType.BAD_GATEWAY:
        super("502 from TFC API.");
        break;
      default:
        throw new Error("Unknown TfcErrorType passed in at construction");
    }
    this.type = type;
  }
}
