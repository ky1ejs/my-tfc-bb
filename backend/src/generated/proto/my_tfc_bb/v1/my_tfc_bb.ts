/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  ChannelOptions,
  Client,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Empty } from "../../google/protobuf/empty";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "my_tfc_bb.v1";

export enum GetDeliveriesFilterType {
  UNCOLLECTED = 0,
  ACTIVE = 1,
  COLLECTED = 2,
  SEARCH = 3,
  UNRECOGNIZED = -1,
}

export function getDeliveriesFilterTypeFromJSON(object: any): GetDeliveriesFilterType {
  switch (object) {
    case 0:
    case "UNCOLLECTED":
      return GetDeliveriesFilterType.UNCOLLECTED;
    case 1:
    case "ACTIVE":
      return GetDeliveriesFilterType.ACTIVE;
    case 2:
    case "COLLECTED":
      return GetDeliveriesFilterType.COLLECTED;
    case 3:
    case "SEARCH":
      return GetDeliveriesFilterType.SEARCH;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetDeliveriesFilterType.UNRECOGNIZED;
  }
}

export function getDeliveriesFilterTypeToJSON(object: GetDeliveriesFilterType): string {
  switch (object) {
    case GetDeliveriesFilterType.UNCOLLECTED:
      return "UNCOLLECTED";
    case GetDeliveriesFilterType.ACTIVE:
      return "ACTIVE";
    case GetDeliveriesFilterType.COLLECTED:
      return "COLLECTED";
    case GetDeliveriesFilterType.SEARCH:
      return "SEARCH";
    case GetDeliveriesFilterType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum PushPlatform {
  PUSH_PLATFORM_UNSPECIFIED = 0,
  IOS = 1,
  ANDROID = 2,
  WEB = 3,
  UNRECOGNIZED = -1,
}

export function pushPlatformFromJSON(object: any): PushPlatform {
  switch (object) {
    case 0:
    case "PUSH_PLATFORM_UNSPECIFIED":
      return PushPlatform.PUSH_PLATFORM_UNSPECIFIED;
    case 1:
    case "IOS":
      return PushPlatform.IOS;
    case 2:
    case "ANDROID":
      return PushPlatform.ANDROID;
    case 3:
    case "WEB":
      return PushPlatform.WEB;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PushPlatform.UNRECOGNIZED;
  }
}

export function pushPlatformToJSON(object: PushPlatform): string {
  switch (object) {
    case PushPlatform.PUSH_PLATFORM_UNSPECIFIED:
      return "PUSH_PLATFORM_UNSPECIFIED";
    case PushPlatform.IOS:
      return "IOS";
    case PushPlatform.ANDROID:
      return "ANDROID";
    case PushPlatform.WEB:
      return "WEB";
    case PushPlatform.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum TokenEnv {
  TOKEN_ENV_UNSPECIFIED = 0,
  PRODUCTION = 1,
  STAGING = 2,
  UNRECOGNIZED = -1,
}

export function tokenEnvFromJSON(object: any): TokenEnv {
  switch (object) {
    case 0:
    case "TOKEN_ENV_UNSPECIFIED":
      return TokenEnv.TOKEN_ENV_UNSPECIFIED;
    case 1:
    case "PRODUCTION":
      return TokenEnv.PRODUCTION;
    case 2:
    case "STAGING":
      return TokenEnv.STAGING;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenEnv.UNRECOGNIZED;
  }
}

export function tokenEnvToJSON(object: TokenEnv): string {
  switch (object) {
    case TokenEnv.TOKEN_ENV_UNSPECIFIED:
      return "TOKEN_ENV_UNSPECIFIED";
    case TokenEnv.PRODUCTION:
      return "PRODUCTION";
    case TokenEnv.STAGING:
      return "STAGING";
    case TokenEnv.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Delivery {
  id: string;
  name: string;
  comment: string;
  dateReceived: Date | undefined;
  collectedAt: Date | undefined;
}

export interface LogInRequest {
  username: string;
  password: string;
  deviceId: string;
}

export interface LogInResponse {
  deviceId: string;
}

export interface GetDeliveriesRequest {
  filter: GetDeliveriesFilterType;
  searchTerm: string;
}

export interface GetDeliveriesResponse {
  deliveries: Delivery[];
  collectedCount: number;
  uncollectedCount: number;
}

export interface UpdatePushTokenRequest {
  platform: PushPlatform;
  env: TokenEnv;
  token: string;
}

function createBaseDelivery(): Delivery {
  return { id: "", name: "", comment: "", dateReceived: undefined, collectedAt: undefined };
}

export const Delivery = {
  encode(message: Delivery, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.comment !== "") {
      writer.uint32(26).string(message.comment);
    }
    if (message.dateReceived !== undefined) {
      Timestamp.encode(toTimestamp(message.dateReceived), writer.uint32(34).fork()).ldelim();
    }
    if (message.collectedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.collectedAt), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Delivery {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelivery();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.comment = reader.string();
          break;
        case 4:
          message.dateReceived = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 5:
          message.collectedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Delivery {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      comment: isSet(object.comment) ? String(object.comment) : "",
      dateReceived: isSet(object.dateReceived) ? fromJsonTimestamp(object.dateReceived) : undefined,
      collectedAt: isSet(object.collectedAt) ? fromJsonTimestamp(object.collectedAt) : undefined,
    };
  },

  toJSON(message: Delivery): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.comment !== undefined && (obj.comment = message.comment);
    message.dateReceived !== undefined && (obj.dateReceived = message.dateReceived.toISOString());
    message.collectedAt !== undefined && (obj.collectedAt = message.collectedAt.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Delivery>, I>>(object: I): Delivery {
    const message = createBaseDelivery();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.comment = object.comment ?? "";
    message.dateReceived = object.dateReceived ?? undefined;
    message.collectedAt = object.collectedAt ?? undefined;
    return message;
  },
};

function createBaseLogInRequest(): LogInRequest {
  return { username: "", password: "", deviceId: "" };
}

export const LogInRequest = {
  encode(message: LogInRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    if (message.deviceId !== "") {
      writer.uint32(26).string(message.deviceId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogInRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogInRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.username = reader.string();
          break;
        case 2:
          message.password = reader.string();
          break;
        case 3:
          message.deviceId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LogInRequest {
    return {
      username: isSet(object.username) ? String(object.username) : "",
      password: isSet(object.password) ? String(object.password) : "",
      deviceId: isSet(object.deviceId) ? String(object.deviceId) : "",
    };
  },

  toJSON(message: LogInRequest): unknown {
    const obj: any = {};
    message.username !== undefined && (obj.username = message.username);
    message.password !== undefined && (obj.password = message.password);
    message.deviceId !== undefined && (obj.deviceId = message.deviceId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LogInRequest>, I>>(object: I): LogInRequest {
    const message = createBaseLogInRequest();
    message.username = object.username ?? "";
    message.password = object.password ?? "";
    message.deviceId = object.deviceId ?? "";
    return message;
  },
};

function createBaseLogInResponse(): LogInResponse {
  return { deviceId: "" };
}

export const LogInResponse = {
  encode(message: LogInResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.deviceId !== "") {
      writer.uint32(10).string(message.deviceId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogInResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogInResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deviceId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LogInResponse {
    return { deviceId: isSet(object.deviceId) ? String(object.deviceId) : "" };
  },

  toJSON(message: LogInResponse): unknown {
    const obj: any = {};
    message.deviceId !== undefined && (obj.deviceId = message.deviceId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LogInResponse>, I>>(object: I): LogInResponse {
    const message = createBaseLogInResponse();
    message.deviceId = object.deviceId ?? "";
    return message;
  },
};

function createBaseGetDeliveriesRequest(): GetDeliveriesRequest {
  return { filter: 0, searchTerm: "" };
}

export const GetDeliveriesRequest = {
  encode(message: GetDeliveriesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.filter !== 0) {
      writer.uint32(8).int32(message.filter);
    }
    if (message.searchTerm !== "") {
      writer.uint32(18).string(message.searchTerm);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDeliveriesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDeliveriesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filter = reader.int32() as any;
          break;
        case 2:
          message.searchTerm = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDeliveriesRequest {
    return {
      filter: isSet(object.filter) ? getDeliveriesFilterTypeFromJSON(object.filter) : 0,
      searchTerm: isSet(object.searchTerm) ? String(object.searchTerm) : "",
    };
  },

  toJSON(message: GetDeliveriesRequest): unknown {
    const obj: any = {};
    message.filter !== undefined && (obj.filter = getDeliveriesFilterTypeToJSON(message.filter));
    message.searchTerm !== undefined && (obj.searchTerm = message.searchTerm);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetDeliveriesRequest>, I>>(object: I): GetDeliveriesRequest {
    const message = createBaseGetDeliveriesRequest();
    message.filter = object.filter ?? 0;
    message.searchTerm = object.searchTerm ?? "";
    return message;
  },
};

function createBaseGetDeliveriesResponse(): GetDeliveriesResponse {
  return { deliveries: [], collectedCount: 0, uncollectedCount: 0 };
}

export const GetDeliveriesResponse = {
  encode(message: GetDeliveriesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.deliveries) {
      Delivery.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.collectedCount !== 0) {
      writer.uint32(16).int32(message.collectedCount);
    }
    if (message.uncollectedCount !== 0) {
      writer.uint32(24).int32(message.uncollectedCount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDeliveriesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDeliveriesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deliveries.push(Delivery.decode(reader, reader.uint32()));
          break;
        case 2:
          message.collectedCount = reader.int32();
          break;
        case 3:
          message.uncollectedCount = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDeliveriesResponse {
    return {
      deliveries: Array.isArray(object?.deliveries) ? object.deliveries.map((e: any) => Delivery.fromJSON(e)) : [],
      collectedCount: isSet(object.collectedCount) ? Number(object.collectedCount) : 0,
      uncollectedCount: isSet(object.uncollectedCount) ? Number(object.uncollectedCount) : 0,
    };
  },

  toJSON(message: GetDeliveriesResponse): unknown {
    const obj: any = {};
    if (message.deliveries) {
      obj.deliveries = message.deliveries.map((e) => e ? Delivery.toJSON(e) : undefined);
    } else {
      obj.deliveries = [];
    }
    message.collectedCount !== undefined && (obj.collectedCount = Math.round(message.collectedCount));
    message.uncollectedCount !== undefined && (obj.uncollectedCount = Math.round(message.uncollectedCount));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetDeliveriesResponse>, I>>(object: I): GetDeliveriesResponse {
    const message = createBaseGetDeliveriesResponse();
    message.deliveries = object.deliveries?.map((e) => Delivery.fromPartial(e)) || [];
    message.collectedCount = object.collectedCount ?? 0;
    message.uncollectedCount = object.uncollectedCount ?? 0;
    return message;
  },
};

function createBaseUpdatePushTokenRequest(): UpdatePushTokenRequest {
  return { platform: 0, env: 0, token: "" };
}

export const UpdatePushTokenRequest = {
  encode(message: UpdatePushTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platform !== 0) {
      writer.uint32(8).int32(message.platform);
    }
    if (message.env !== 0) {
      writer.uint32(16).int32(message.env);
    }
    if (message.token !== "") {
      writer.uint32(26).string(message.token);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdatePushTokenRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdatePushTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.platform = reader.int32() as any;
          break;
        case 2:
          message.env = reader.int32() as any;
          break;
        case 3:
          message.token = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdatePushTokenRequest {
    return {
      platform: isSet(object.platform) ? pushPlatformFromJSON(object.platform) : 0,
      env: isSet(object.env) ? tokenEnvFromJSON(object.env) : 0,
      token: isSet(object.token) ? String(object.token) : "",
    };
  },

  toJSON(message: UpdatePushTokenRequest): unknown {
    const obj: any = {};
    message.platform !== undefined && (obj.platform = pushPlatformToJSON(message.platform));
    message.env !== undefined && (obj.env = tokenEnvToJSON(message.env));
    message.token !== undefined && (obj.token = message.token);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdatePushTokenRequest>, I>>(object: I): UpdatePushTokenRequest {
    const message = createBaseUpdatePushTokenRequest();
    message.platform = object.platform ?? 0;
    message.env = object.env ?? 0;
    message.token = object.token ?? "";
    return message;
  },
};

export type MyTfcServiceService = typeof MyTfcServiceService;
export const MyTfcServiceService = {
  logIn: {
    path: "/my_tfc_bb.v1.MyTfcService/LogIn",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: LogInRequest) => Buffer.from(LogInRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => LogInRequest.decode(value),
    responseSerialize: (value: LogInResponse) => Buffer.from(LogInResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => LogInResponse.decode(value),
  },
  getDeliveries: {
    path: "/my_tfc_bb.v1.MyTfcService/GetDeliveries",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetDeliveriesRequest) => Buffer.from(GetDeliveriesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetDeliveriesRequest.decode(value),
    responseSerialize: (value: GetDeliveriesResponse) => Buffer.from(GetDeliveriesResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetDeliveriesResponse.decode(value),
  },
  updatePushToken: {
    path: "/my_tfc_bb.v1.MyTfcService/UpdatePushToken",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdatePushTokenRequest) => Buffer.from(UpdatePushTokenRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdatePushTokenRequest.decode(value),
    responseSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Empty.decode(value),
  },
  sendTestPushNotication: {
    path: "/my_tfc_bb.v1.MyTfcService/SendTestPushNotication",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    requestDeserialize: (value: Buffer) => Empty.decode(value),
    responseSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Empty.decode(value),
  },
  logOut: {
    path: "/my_tfc_bb.v1.MyTfcService/LogOut",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    requestDeserialize: (value: Buffer) => Empty.decode(value),
    responseSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Empty.decode(value),
  },
} as const;

export interface MyTfcServiceServer extends UntypedServiceImplementation {
  logIn: handleUnaryCall<LogInRequest, LogInResponse>;
  getDeliveries: handleUnaryCall<GetDeliveriesRequest, GetDeliveriesResponse>;
  updatePushToken: handleUnaryCall<UpdatePushTokenRequest, Empty>;
  sendTestPushNotication: handleUnaryCall<Empty, Empty>;
  logOut: handleUnaryCall<Empty, Empty>;
}

export interface MyTfcServiceClient extends Client {
  logIn(
    request: LogInRequest,
    callback: (error: ServiceError | null, response: LogInResponse) => void,
  ): ClientUnaryCall;
  logIn(
    request: LogInRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: LogInResponse) => void,
  ): ClientUnaryCall;
  logIn(
    request: LogInRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: LogInResponse) => void,
  ): ClientUnaryCall;
  getDeliveries(
    request: GetDeliveriesRequest,
    callback: (error: ServiceError | null, response: GetDeliveriesResponse) => void,
  ): ClientUnaryCall;
  getDeliveries(
    request: GetDeliveriesRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetDeliveriesResponse) => void,
  ): ClientUnaryCall;
  getDeliveries(
    request: GetDeliveriesRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetDeliveriesResponse) => void,
  ): ClientUnaryCall;
  updatePushToken(
    request: UpdatePushTokenRequest,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  updatePushToken(
    request: UpdatePushTokenRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  updatePushToken(
    request: UpdatePushTokenRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  sendTestPushNotication(
    request: Empty,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  sendTestPushNotication(
    request: Empty,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  sendTestPushNotication(
    request: Empty,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  logOut(request: Empty, callback: (error: ServiceError | null, response: Empty) => void): ClientUnaryCall;
  logOut(
    request: Empty,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  logOut(
    request: Empty,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
}

export const MyTfcServiceClient = makeGenericClientConstructor(
  MyTfcServiceService,
  "my_tfc_bb.v1.MyTfcService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): MyTfcServiceClient;
  service: typeof MyTfcServiceService;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
