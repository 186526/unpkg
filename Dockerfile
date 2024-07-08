FROM node:alpine as builder

RUN npm install pnpm -g

COPY / ./

RUN pnpm install -D && pnpm run build && ls -al -R

FROM node:alpine

COPY --from=builder server.js ./
COPY --from=builder package.json ./

RUN npm install pm2 pnpm -g && pnpm install

CMD [ "pm2-runtime", "start", "pm2.json" ]
