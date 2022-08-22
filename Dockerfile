FROM node:lts-alpine
WORKDIR /app
COPY . .
ENV PORT=3333
EXPOSE ${PORT}
RUN npm install
RUN npm run build
CMD node ./dist/apps/servercito/main.js

