FROM node:17.1.0-alpine3.14 AS base

COPY --from=pulumi/pulumi-base:3.18.1 /pulumi/bin/pulumi /usr/bin/pulumi

COPY --from=alpine/helm:3.7.1 /usr/bin/helm /usr/bin/helm

ENV PROJECT_ROOT="/app"
ENV PATH="${PROJECT_ROOT}/bin:${PROJECT_ROOT}/node_modules/.bin:${PATH}"

WORKDIR $PROJECT_ROOT
RUN chown node:node $PROJECT_ROOT

ENV HELM_REPOSITORY_CACHE /helm/cache
ENV HELM_CACHE_HOME $HELM_REPOSITORY_CACHE
RUN mkdir -p $HELM_REPOSITORY_CACHE && \
    chown node:node $HELM_REPOSITORY_CACHE

FROM base AS dependencies

COPY package.json .
COPY package-lock.json .

RUN npm install
# /app/node_modules is where all the dependency files live


FROM base AS local

ENV NODE_ENV="local"
ENV PULUMI_CONFIG_PASSPHRASE=""
ENV KUBECONFIG="${PROJECT_ROOT}/.cache/kubeconfig.yml"

ARG HOST_DOCKER_GROUP_ID

RUN addgroup -g $HOST_DOCKER_GROUP_ID docker && \
    adduser node docker

RUN apk update && apk add curl bash
SHELL ["/bin/bash", "-c"]

COPY --from=docker:20.10.10 /usr/local/bin/docker /usr/local/bin/docker

RUN curl -s https://raw.githubusercontent.com/rancher/k3d/main/install.sh | TAG=v5.1.0 bash

COPY --from=devspacesh/devspace:5.17.0 /bin/devspace /usr/local/bin/devspace

COPY --from=dependencies /app/node_modules /app/node_modules

USER node

CMD vfm ; bash


FROM base AS production

LABEL org.opencontainers.image.source=https://github.com/Covik/vfm-system

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
