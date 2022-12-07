#!/bin/sh

#  ci_post_clone.sh
#  My TFC BB
#
#  Created by Kyle Satti on 12/4/22.
#  
brew install protoc
brew install swift-protobuf
brew install grpc-swift
brew install bufbuild/buf/buf

cd ..
ls -la
pwd
buf generate ../backend/proto
