ARG NODE_VERSION=20.14.0-alpine

FROM node:$NODE_VERSION as builder

WORKDIR /modules

RUN npm install passport-custom @passport-next/passport

ARG UNLEASH_SERVER_VERSION=6.0.6

FROM unleashorg/unleash-server:$UNLEASH_SERVER_VERSION

COPY --from=builder /modules/node_modules/ /unleash/node_modules/
COPY index.js ./
