FROM node:alpine as builder

COPY / ./

RUN apk add git --no-cache && yarn install -D 
RUN yarn run build && ls -al -R

FROM node:alpine

COPY --from=builder server.js ./
COPY --from=builder package.json ./

RUN npm install pm2 pnpm -g && pnpm install

CMD [ "pm2-runtime", "start", "pm2.json" ]
