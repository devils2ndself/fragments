# Stage 1: download node modules
FROM node:16.14.2@sha256:6e54786b2ad01667d46524e82806298714f50d2be72b39706770aed55faedbd7 AS dependencies

# Set as production (no dev dependencies)
ENV NODE_ENV=production

# Define working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci
RUN npm rebuild --platform=linux --arch=x64 --libc=musl sharp

#######################

# Stage 2: running the app
FROM node:16.14.2-alpine@sha256:28bed508446db2ee028d08e76fb47b935defa26a84986ca050d2596ea67fd506

# Use a user different from root
USER node

# Define working directory
WORKDIR /app

COPY --chown=node:node --from=dependencies /app ./

# Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# Copy our HTPASSWD file
COPY --chown=node:node ./env.jest ./.env

LABEL maintainer="Artem Tanyhin <atanyhin@myseneca.ca>" \
  description="Fragments node.js microservice"

# Environment variables setup
  # use port 8080
ENV PORT=8080 \
  # Reduce npm spam
  NPM_CONFIG_LOGLEVEL=warn \
  # Disable coloring
  NPM_CONFIG_COLOR=false

# Start the container by running our server
CMD ["node", "src/index.js"]

HEALTHCHECK --interval=3m --timeout=3s \
  CMD curl -f http://localhost:8080 || exit 1

# Open port 8080
EXPOSE 8080
