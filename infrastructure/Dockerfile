FROM node:17.0.1-alpine3.14 AS base

COPY --from=pulumi/pulumi-base:3.12.0 /pulumi/bin/pulumi /usr/bin/pulumi

COPY --from=alpine/helm:3.6.3 /usr/bin/helm /usr/bin/helm

ENV PROJECT_ROOT="/app"
ENV PATH="${PROJECT_ROOT}/bin:${PROJECT_ROOT}/node_modules/.bin:${PATH}"

WORKDIR $PROJECT_ROOT

RUN chown node:node /app


FROM base AS dependencies

COPY package.json .
COPY package-lock.json .

RUN npm install
# /app/node_modules is where all the dependency files live


FROM base AS local

ENV NODE_ENV="local"
ENV PULUMI_CONFIG_PASSPHRASE=""

ARG HOST_DOCKER_GROUP_ID

RUN addgroup -g $HOST_DOCKER_GROUP_ID docker && \
    adduser node docker

RUN apk update && apk add curl bash
SHELL ["/bin/bash", "-c"]

COPY --from=docker:20.10.10 /usr/local/bin/docker /usr/local/bin/docker

RUN curl -s https://raw.githubusercontent.com/rancher/k3d/main/install.sh | TAG=v5.0.1 bash

COPY --from=dependencies /app/node_modules /app/node_modules

USER node

CMD vfm ; bash


FROM base AS production

ENV NODE_ENV="production"

# These variables should be set in runtime
ENV PULUMI_ACCESS_TOKEN=""
ENV DIGITALOCEAN_TOKEN=""
ENV CLUSTER_TOKEN=""
ENV CLUSTER_CONTAINER_REGISTRY_TOKEN=""

COPY --from=dependencies /app/node_modules /app/node_modules
COPY . .

USER node

# should not be runnable without explicitly defined command
# command should be defined in Makefile
CMD ["exit", "-1"]
