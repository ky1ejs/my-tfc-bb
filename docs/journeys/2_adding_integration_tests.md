# Setting up integration tests

## Goal
After adding some new failure types for authentication, I wanted to assert that given some particular state in the DB and a particular response from the My TFC API, the correct gRPC error would be returned to the client.

I could also have tested this in prod manually, but overall it felt only slightly slower, if not the same, to do this in code and would pay my dividends by having some tests running on deply as well as helping me learn how to run CockroachDB locally.

## High level steps
1. Should I do unit or integration tests?
2. How do I call the RPCs from the test?
3. How do I mock the My TFC API?
4. What do I run the tests?
5. How do I test against a database and create the state neccessary for each test?

## 1. Should I do unit or integration tests?
In the end I decided yes since I test a whole bunch of code related to a single API call rather than having to write a bunch of tests to cover the same code and probably refactor this code to enable dependency injection in order to test things.

## 2. How do I call the RPCs from the test?
This took a bit of playing around and googling, mainly the former. A huge help was looking at some of the [tests in `grpc-js`](https://github.com/grpc/grpc-node/blob/master/packages/grpc-js/test/test-server.ts). I followed this a fair amount and ended at a solution where I booted up the service and created a client from the `.proto` definitions. Namely [these lines](https://github.com/grpc/grpc-node/blob/master/packages/grpc-js/test/test-server.ts#L242-L272) were key from `grpc-js`.

## 3. How do I mock the My TFC API?
I did a bit of googling and found some approaches for mocking Axios, but nothing seemed great. I eventually came across [this post](https://danieljcafonso.medium.com/how-to-test-api-calls-e210c07cd3c2) which compared some Axios mocking approaches and then finally offered [MSW](https://danieljcafonso.medium.com/how-to-test-api-calls-e210c07cd3c2) as the best way to go.

Having used [OHTTPStubs](https://github.com/AliSoftware/OHHTTPStubs) in the past, I bought in to [MSW](https://danieljcafonso.medium.com/how-to-test-api-calls-e210c07cd3c2) pretty quickly.

## 4. What do I run the tests?
After goolging, the defacto seems to be Jest. I checked a couple of my past TypeScript projects and found I also used Jest there, so Jest it was.

Jest doesn't seem to differentiate between what is an IT and what a Unit Test, but I'm sure I could get it to if I wanted to.

I found [a guide](https://javascript.plainenglish.io/beginners-guide-to-testing-jest-with-node-typescript-1f46a1b87dad) to use `ts-jest` that simplified the whole thing quite a bit and saved me from transpilling myself.

## 5. How do I test against a database and create the state neccessary for each test?
This has been by far the most time consuming part. (you guessed it) I did a bit of googling before I realised that Prisma probably have some recommendation; they did! Prisma recommended to [run a postgres instance using `docker-compose`](https://www.prisma.io/docs/guides/testing/integration-testing). The alternative would have been to create some abstraction for the sql code so that I could inject my own mock implementation for the tests, but running against an actual Postgres DB felt a lot less work and keeps the idea of writing ITs going properly.

Here's what the `docker-compose` yaml that Prisma recommended looks like:
```yaml
# Set the version of docker compose to use
version: '3.9'

# The containers that compose the project
services:
  db:
    image: postgres:13
    restart: always
    container_name: integration-tests-prisma
    ports:
      - '5433:5432'
    environment:
      POSTGRES_USER: prisma
      POSTGRES_PASSWORD: prisma
      POSTGRES_DB: tests
```

When trying to run against this database in the tests I ran in to errors during migrations due to CockroachDB using `"STRING"` when postgres would use `TEXT` or `VARCHAR`. I'm not sure how Prisma, the program that generated the migrations, somehow understood that I was using CockroachDB despite me [setting the provider to `"postgresql"`](https://github.com/ky1ejs/my-tfc-bb/blob/f49a446a4ffc70600fbb1ed50aa5a7f59ea077f5/backend/prisma/schema.prisma#L9). 

At first I just edited all my migrations to use `TEXT` instead of `STRING` so that I could continue to getting my tests to work, before I burried more time into just getting the DB to boot.

After getting a initial test assertion written, I came back to this to fix the issue. I assumed that CockroachDB must have a way to run locally, not just for testing purposes but also for development purposes. That assumption [was correct](https://www.cockroachlabs.com/docs/stable/local-testing.html).

It took some playing around, but in the end I found the right `docker-compose` definition to run CockroachDB for the tests.

One thing I had to guess was how to get my tests to access the CockroachDB instance since the port was not being mapped outside of the docker container. By using `docker ps` and some guess work, I could see that `0.0.0.0:8080->8080/tcp` was mapped, and that's why I could reach the cluster info panel in the browser. This mapping was happening because of this definition in the yaml:
```yaml
ports:
  - "8080:8080"
```
After realising this I just added one more line that mapped a port of my choosing to the CockroachDB port:
```yaml
ports:
  - "5433:26257"
  - "8080:8080"
```

Here are some useful links I found in the process:
* [Start a Local Cluster (Insecure)](https://www.cockroachlabs.com/docs/stable/start-a-local-cluster.html)
* [`cockroach start-single-node api` reference](https://www.cockroachlabs.com/docs/v22.2/cockroach-start-single-node#store)
* [Test Your Application Locally](https://www.cockroachlabs.com/docs/stable/local-testing.html)
* [How to Do a Clean Restart of a Docker Instance](https://docs.tibco.com/pub/mash-local/4.3.0/doc/html/docker/GUID-BD850566-5B79-4915-987E-430FC38DAAE4.html)
* [CockroachDB Data Types Cheatsheet](https://tableplus.com/blog/2018/09/cockroachdb-data-types-cheatsheet.html)
* [CockroachDB Integration Testing](https://robreid.io/crdb-integration-testing/)
* [CockroachDB and Docker Compose gist](https://gist.github.com/dbist/ebb1f39f580ad9d07c04c3a3377e2bff)
* [Prisma - Integration testing](https://www.prisma.io/docs/guides/testing/integration-testing)
