FROM node:alpine

RUN mkdir -p /usr/src/app

ENV PORT 3001

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

#USER node

RUN npm install

COPY . /usr/src/app/

RUN npm run build

# RUN npx prisma migrate dev

EXPOSE 3001

CMD [ "npm", "run", "start:dev" ]