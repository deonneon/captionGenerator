FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json .env ./
COPY pages/ ./pages/
COPY public/ ./public/

RUN npm install


RUN npx next build

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
