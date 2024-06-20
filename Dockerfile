# Use the official Bun image as a base image
FROM node:lts-slim

# Set the working directory
WORKDIR /app
# Install Python3 and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Copy package.json and bun.lockb
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
