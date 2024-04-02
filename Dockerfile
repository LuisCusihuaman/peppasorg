FROM node:14.21.3-alpine3.17
WORKDIR /app
COPY . .
ENV PORT=3333
EXPOSE ${PORT}
RUN npm install
RUN npm run build
CMD node ./dist/apps/servercito/main.js

