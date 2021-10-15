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