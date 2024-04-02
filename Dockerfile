FROM node:20.12.0-alpine3.19
WORKDIR /app
RUN npm install -g pnpm
COPY . .
ENV PORT=8080
EXPOSE ${PORT}
RUN pnpm install
RUN pnpm run build
CMD node ./dist/apps/servercito/main.js

