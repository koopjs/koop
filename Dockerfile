# Use the official Node.js image as the base image
FROM node:22-slim

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Copy the packages in this monorepo to the container
COPY ./packages ./packages

# Install the required npm packages in the container
RUN npm install

# Copy the demo code and other necessary files to the container
COPY demo ./demo

# Expose port 8080 for the Koop server
EXPOSE 8080

# Start the Koop server
CMD ["npm", "run", "demo"]
