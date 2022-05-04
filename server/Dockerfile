FROM node

RUN mkdir -p /usr/src/app

ENV PORT 3001

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

#USER node

RUN npm install

COPY . /usr/src/app/

RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD [ "npm", "run", "start:dev" ]