FROM node:16.11-alpine3.14 AS base
WORKDIR /app
# should not be runnable without explicitly defined command
CMD ["exit", "-1"]


FROM base AS dependencies
COPY package*.json .
RUN npm install


FROM base AS production-artifact
COPY --from=dependencies /app/node_modules /app/node_modules
COPY . .
RUN npm run build -- --dest=/app/artifact --modern


FROM nginx:1.21.3-alpine AS production-server
LABEL org.opencontainers.image.source=https://github.com/Covik/vfm-system
COPY --from=production-artifact --chown=root:root /app/artifact /usr/share/nginx/html


FROM base AS development-environment
RUN apk update && apk add bash
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH="/home/node/.npm-global/bin:${PATH}"
RUN chown node:node /app
USER node
RUN npm install -g @vue/cli
COPY --from=dependencies --chown=node:node /app/node_modules /app/node_modules
COPY --chown=node:node . .
CMD ["npm", "run", "serve"]