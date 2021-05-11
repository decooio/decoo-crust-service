FROM node:14-alpine
WORKDIR /app
COPY dist /app/dist
EXPOSE 3000
CMD ["node", "./dist/app.js"]
