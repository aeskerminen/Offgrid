FROM node:12.18.1

expose 8000

WORKDIR /app

COPY . .

RUN npm install


CMD ["node", "initialize.js"]
CMD ["node", "index.js"]