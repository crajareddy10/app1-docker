# FROM node:16

# WORKDIR /bidbiddy_server

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD [ "npm", "start" ]


FROM node:16

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

VOLUME ["app/npde_modules"]

CMD node server.js