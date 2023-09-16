FROM alpine

RUN apk add --update nodejs npm

WORKDIR /usr/src/react-app

COPY package*.json /usr/src/react-app/

RUN npm install 

COPY . /usr/src/react-app

EXPOSE 3000

CMD [ "npm" , "run" , "dev" ]