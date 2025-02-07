FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy only necessary application files
COPY models/ ./models/
COPY index.js ./

EXPOSE 5000

CMD ["yarn", "start"]
