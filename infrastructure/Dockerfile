FROM node:16.7-alpine3.14 AS base

COPY --from=pulumi/pulumi-base:3.12.0 /pulumi/bin/pulumi /usr/bin/pulumi

COPY --from=alpine/helm:3.6.3 /usr/bin/helm /usr/bin/helm

ENV PROJECT_ROOT='/app'

WORKDIR $PROJECT_ROOT

RUN chown node:node /app


FROM base AS production-artifact

COPY . .

RUN npm install
RUN npm run build
# /app/dist and /app/node_modules is where all the final JS files live


FROM base AS development

ENV NODE_ENV='local'
ENV PATH="${PROJECT_ROOT}/node_modules/.bin:${PATH}"
ENV PULUMI_CONFIG_PASSPHRASE=''

ARG HOST_DOCKER_GROUP_ID

RUN addgroup -g $HOST_DOCKER_GROUP_ID docker && \
    adduser node docker

RUN apk update && apk add curl bash
SHELL ["/bin/bash", "-c"]

COPY --from=docker:20.10.8 /usr/local/bin/docker /usr/local/bin/docker

RUN curl -s https://raw.githubusercontent.com/rancher/k3d/main/install.sh | bash

COPY --from=production-artifact /app/node_modules /app/node_modules

USER node


FROM base AS test

COPY --from=production-artifact /app/node_modules /app/node_modules
COPY ./src ./src
COPY package.json .
COPY jest.config.js .
COPY tsconfig.json .

CMD ["npm", "run", "test"]


FROM base AS production

ENV NODE_ENV='production'

# These variables should be set in runtime
ENV PULUMI_ACCESS_TOKEN=''
ENV DIGITALOCEAN_TOKEN=''
ENV CLUSTER_TOKEN=''

COPY --from=production-artifact /app/dist /app/dist
COPY --from=production-artifact /app/node_modules /app/node_modules
COPY package.json package.json

USER node

CMD ["npm", "run", "production"]
