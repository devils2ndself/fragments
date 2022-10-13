# Use node image as base
FROM node:16.14.2

LABEL maintainer="Artem Tanyhin <atanyhin@myseneca.ca>" \
  description="Fragments node.js microservice"

# Environment variables setup
  # use port 8080
ENV PORT=8080 \
  # Reduce npm spam
  NPM_CONFIG_LOGLEVEL=warn \
  # Disable coloring
  NPM_CONFIG_COLOR=false

# Define working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm start

# Open port 8080
EXPOSE 8080
