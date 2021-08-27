FROM node:16.7-alpine3.14

COPY --from=pulumi/pulumi-base:3.11.0 /pulumi/bin/pulumi /usr/bin/pulumi

WORKDIR /app

RUN chown node:node /app