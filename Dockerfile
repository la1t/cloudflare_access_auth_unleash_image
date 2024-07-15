ARG NODE_VERSION=20.14.0-alpine

FROM node:$NODE_VERSION as builder

WORKDIR /modules

RUN npm install passport-custom @passport-next/passport

FROM unleashorg/unleash-server

COPY --from=builder /modules/node_modules/ /unleash/node_modules/
COPY index.js ./
