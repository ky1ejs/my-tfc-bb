
## Protobuf / gRPC


## Node / TypeScript

* [Inteceptors available via other frameworks](https://github.com/grpc/grpc-node/issues/419)
  * [anotha one](https://github.com/grpc/grpc-node/issues/350)
  * [ProtoCat](https://grissius.github.io/protocat/)
  * [Mali](https://mali.js.org/)

### Blog Posts Visited

**Node.js gRPC**
[Node.js gRPC Services in Style](https://medium.com/trabe/node-js-grpc-services-in-style-222389be991a)

**Trying to call `ts-node` via grpc/grpc-js**
[grpcurl - looking how to call Node.js via gRPC](https://github.com/fullstorydev/grpcurl)

Turns out you need to pass the proto definition to the `grpcurl` as `grpc/grpc-js` has no reflection for `grpcurl` to figure out the calls itself.

**Another `ts-node` example**
[This](https://github.com/CatsMiaow/node-grpc-typescript/blob/master/src/server.ts) is pretty much exactly what I have in this service now.

**Example `grpcurl`**
```
grpcurl
-d ‘{
“customer_id”: “abc123”,
“email”: “someone@example.com”,
“name”: “Someone”,
“address”: {
“street”: “123 Some Street”,
“city”: “Somewhere”
}
}’
–plaintext localhost:8080
customer.api.CustomerService/Create1
```

### Code gen

Three choices I found:
* https://github.com/stephenh/ts-proto - the one I chose
* https://github.com/thesayyn/protoc-gen-ts
* https://github.com/agreatfool/grpc_tools_node_protoc_ts
* https://github.com/timostamm/protobuf-ts - don't think I even tried this one in the end

Crazy that there are so many! And all of these have contributions in the last 2 weeks at the time of writing this (4th Dec 2022).

After trying [grpc_tools_node_protoc_ts](https://github.com/agreatfool/grpc_tools_node_protoc_ts) first, [ts-proto](https://github.com/stephenh/ts-proto) was my choice after finding it generated service code for `grpc/grpc-js` (with option `outputServices=grpc-js`). 

I don't fully understand `grpc_tools_node_protoc_ts`, but based on it's GitHub description:
> Generate TypeScript d.ts definitions for generated js files from grpc_tools_node_protoc
it seems to me that it uses the standard `protoc` JavaScript plugin to transpile TypeScript code. If I'm right in that, `ts-proto` seems a lot more effective as it generates TypeScript directly and can leverage language features more effectively.  [Here's a file](https://github.com/mrjbond/blogging/blob/master/grpc-node-buf-typescript/proto/buf.gen.yaml) that shows the JS plugin being activated followed by `grpc_tools_node_protoc_plugin`. I believe [this](https://dev.to/devaddict/use-grpc-with-node-js-and-typescript-3c58) was the blog post that introduced me to `grpc_tools_node_protoc_plugin`.

There's also `protoc-gen-ts`, which by its README seems like a great option. I'm not sure where I found this one, probably in a blog post mentioned above.  It claims that `ts-proto` isn't as good but those statements seem to be outdated, with claims that things like gRPC Node is not supported when in fact it is.

**Articles on `ts-proto`**
I'm trying to find where I discovered `ts-proto`. [Here's](https://blog.mechanicalrock.io/2022/04/08/getting-started-with-protobufs-and-typescript.html) the only article that I found.

I probably just took the `buf` yaml from the [README for `ts-proto`](https://github.com/stephenh/ts-proto#buf).


**Other articles**
* https://github.com/hopin-team/twirp-ts



## iOS

### protobuf
[apple/swift-protobuf](https://github.com/apple/swift-protobuf)

### gRPC
Found gRPC via [this](https://github.com/apple/swift-protobuf/issues/682) issue when googling for gRPC support in Swift.

1. [grpc/grpc-swift Tutorial](https://github.com/grpc/grpc-swift/blob/main/docs/basic-tutorial.md)
2. [grpc/grpc-swift Interceptors Tutorial - used for auth](https://github.com/grpc/grpc-swift/blob/main/docs/interceptors-tutorial.md)

### Tools

**`protoc`**
You need two `protoc` plugins: swift-protobuf and grpc-swift
```bash
brew install swift-protobuf grpc-swift
```

**Buf for defining generation**
`[Buf generage](https://docs.buf.build/generate/usage)`

I'm not sure exactly how much Buf helps... I could have just used `protoc` directly, however tutorials I found used Buf and I didn't want to spend too much time trying to integrate gRPC rather than building my feature.

This is what happened when I tried to run `protoc` (I tried for all of 2 mins but quit bc `buf` was working fine for me):
```bash
❯ protoc --swift_out=. ../shared/proto/v1/my-tfc-bb.proto
../shared/proto/v1/my-tfc-bb.proto: File does not reside within any path specified using --proto_path (or -I).  You must specify a --proto_path which encompasses this file.  Note that the proto_path must be an exact prefix of the .proto file names -- protoc is too dumb to figure out when two paths (e.g. absolute and relative) are equivalent (it's harder than you think)
```

* [More generation docs](https://github.com/grpc-ecosystem/grpc-gateway/issues/2039)
* [Trying to figure out how to define the buf.gen.yaml file](https://github.com/mrjbond/blogging/blob/master/grpc-node-buf-typescript/proto/buf.gen.yaml)
  * In the end I don't think either `js` (note that this will map to the standard `js-protobuf` plugin) or `grpc_tools_node_protoc_plugin`



