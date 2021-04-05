FROM node:alpine

WORKDIR /app

EXPOSE 3000

COPY package.json .

RUN npm install --no-package-lock

COPY . .

CMD ["npm", "start"]
