FROM node:22.23.4-bookworm-slim@sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN node --version \
    && npm ci

COPY . .

ARG SITE_URL=https://apexpackagingsolutions.com
ENV SITE_URL=${SITE_URL}

RUN npm run build \
    && npm prune --omit=dev

FROM node:22.23.4-bookworm-slim@sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/server.mjs /app/redirects.mjs ./
COPY --from=build --chown=node:node /app/server ./server

RUN mkdir -p /app/data \
    && chown node:node /app/data

USER node
EXPOSE 8080

CMD ["node", "server.mjs"]
