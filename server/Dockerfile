FROM node:latest

ENV PORT 3001

WORKDIR /usr/src/app

COPY package*.json ./

#USER node

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD [ "sh", "entrypoint.sh" ]