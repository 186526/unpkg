FROM node:alpine as builder

COPY / ./

RUN sed -i 's/dl-cdn.alpinelinux.org/ap.edge.kernel.org/g' /etc/apk/repositories && \
    apk add git --no-cache && yarn install -D 
RUN yarn run build && ls -al -R

FROM node:alpine

COPY --from=builder server.js ./
COPY --from=builder package.json ./

RUN yarn global add pnpm pm2 && pnpm install -P

CMD [ "pm2-runtime", "start", "pm2.json" ]