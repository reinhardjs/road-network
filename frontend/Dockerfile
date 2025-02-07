FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN yarn install

# Copy only necessary files
COPY .env .
COPY next.config.mjs .
COPY public/ public/
COPY src/ src/
COPY tailwind.config.mjs .
COPY postcss.config.mjs .

EXPOSE 3000

RUN yarn build

CMD ["yarn", "start"]
