FROM node:20.12-alpine3.18

# set working directory
WORKDIR /express-boilerplate/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install dependencies
RUN npm ci

# Copy the rest of the app files to the working directory
COPY . .

# Build TypeScript files
RUN npm run build

# Expose port
EXPOSE 3000

# Command to run your app in production mode
CMD [ "node", "dist/app.js" ]