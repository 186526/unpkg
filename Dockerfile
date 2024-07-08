FROM node:alpine

RUN npm install pm2 pnpm -g

COPY / ./

RUN pnpm install --production && ls -al -R

CMD [ "pm2-runtime", "start", "pm2.json" ]
