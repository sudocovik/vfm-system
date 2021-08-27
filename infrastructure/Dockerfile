FROM node:16.7-alpine3.14 AS development

COPY --from=pulumi/pulumi-base:3.11.0 /pulumi/bin/pulumi /usr/bin/pulumi

WORKDIR /app

RUN chown node:node /app


FROM development AS production-artifact

COPY . .

RUN npm install
RUN npm run build
# /app/dist and /app/node_modules is where all the final JS files live


FROM development AS production

# These variables should be set in runtime
ENV PULUMI_ACCESS_TOKEN=''
ENV DIGITALOCEAN_TOKEN=''

COPY --from=production-artifact /app/dist /app/dist
COPY --from=production-artifact /app/node_modules /app/node_modules
COPY package.json package.json

CMD ["npm", "run", "production"]