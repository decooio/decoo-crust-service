FROM node:14-alpine
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
EXPOSE 3000
CMD ["node", "./dist/app.js"]

