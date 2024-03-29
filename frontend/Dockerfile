FROM node:18.7.0-alpine3.15 AS base
# should not be runnable without explicitly defined command
CMD ["exit", "-1"]


FROM base AS dependencies
WORKDIR /dependencies
COPY package.json .
COPY yarn.lock .
RUN CYPRESS_INSTALL_BINARY=0 yarn install --frozen-lockfile


FROM base AS source
WORKDIR /source
COPY --from=dependencies /dependencies/node_modules /source/node_modules
COPY . .


FROM base AS production-artifact
ARG google_maps_key
ENV GOOGLE_MAPS_KEY=$google_maps_key
WORKDIR /build
COPY --from=source /source /build
RUN npx quasar build -m pwa


FROM nginx:1.23.1-alpine AS production-server
LABEL org.opencontainers.image.source=https://github.com/Covik/vfm-system
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=production-artifact --chown=root:root /build/dist/pwa /usr/share/nginx/html


FROM base AS development-environment
ENV CYPRESS_INSTALL_BINARY=0
RUN apk update && apk add bash
RUN mkdir /yarn && chown node:node /yarn
USER node
WORKDIR /app
RUN yarn config set prefix /yarn
ENV PATH="/yarn/bin:/app/node_modules/.bin:${PATH}"
RUN yarn global add @quasar/cli@1.3.2
COPY --from=source --chown=node:node /source /app
CMD ["quasar", "dev"]


FROM cypress/included:10.6.0 as test-environment
USER node
WORKDIR /testing
ENV PATH="/testing/node_modules/.bin:${PATH}"
COPY --from=source --chown=node:node /source /testing
# should not be runnable without explicitly defined command
ENTRYPOINT "bash"
CMD ["exit", "-1"]
