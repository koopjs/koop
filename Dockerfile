# Use the official Node.js image as the base image
FROM node:16.20.2

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install the required npm packages in the container
RUN npm install

# Copy the demo code and other necessary files to the container
COPY demo ./demo

# Expose port 8080 for the Koop server
EXPOSE 8080

# Start the Koop server
CMD ["node", "demo/index.js"]