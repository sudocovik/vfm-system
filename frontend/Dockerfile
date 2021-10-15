FROM node:16.11-alpine3.14 AS source

WORKDIR /app
COPY . .
RUN npm ci

# should not be runnable without explicitly defined command
CMD ["exit", "-1"]


FROM source AS production-artifact

RUN npm run build -- --dest=./artifact --modern

# should not be runnable, use only as part of multi-stage build
CMD ["exit", "-1"]

FROM nginx:1.21.3-alpine AS production-server

LABEL org.opencontainers.image.source=https://github.com/Covik/vfm-system

COPY --from=production-artifact --chown=root:root /app/artifact /usr/share/nginx/html


FROM node:16.11-alpine3.14 AS development-environment

RUN apk update && apk add bash

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH="/home/node/.npm-global/bin:${PATH}"

WORKDIR /app
RUN chown node:node /app

COPY --chown=node:node . .

USER node

RUN npm install -g @vue/cli
RUN npm ci

CMD ["npm", "run", "serve", "--", "--host=0.0.0.0"]