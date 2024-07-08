FROM node:alpine as builder

COPY / ./

RUN apk add git --no-cache && yarn install -D 
RUN yarn run build && ls -al -R

FROM node:alpine

COPY --from=builder server.js ./
COPY --from=builder package.json ./

RUN npm install pnpm -g && pnpm install -g pm2 && pnpm install -P

CMD [ "pm2-runtime", "start", "pm2.json" ]
