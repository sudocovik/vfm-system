FROM node:16.11-alpine3.14 AS base
# should not be runnable without explicitly defined command
CMD ["exit", "-1"]


FROM base AS dependencies
WORKDIR /dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install


FROM base AS source
WORKDIR /source
COPY --from=dependencies /dependencies/node_modules /source/node_modules
COPY . .


FROM base AS production-artifact
WORKDIR /build
COPY --from=source /source /build
RUN npm run build -- --dest=/build/artifact --modern


FROM nginx:1.21.3-alpine AS production-server
LABEL org.opencontainers.image.source=https://github.com/Covik/vfm-system
COPY --from=production-artifact --chown=root:root /build/artifact /usr/share/nginx/html


FROM base AS development-environment
RUN apk update && apk add bash
RUN mkdir /yarn && chown node:node /yarn
USER node
WORKDIR /app
RUN yarn config set prefix /yarn
ENV PATH="/yarn/bin:${PATH}"
RUN yarn global add @vue/cli@4.5.15 @quasar/cli@1.2.2
COPY --from=source --chown=node:node /source /app
CMD ["quasar", "dev"]
