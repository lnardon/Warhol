# Step 1: Build the React app
FROM node:16-alpine AS build-stage
WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Build the React app
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Step 2: Setup the Node server
FROM node:16-alpine
WORKDIR /app

# Copy built React app
COPY --from=build-stage /app/frontend/build/ ./frontend/build/

# Install server dependencies
COPY package*.json ./
RUN npm ci

# Copy server files
COPY . .

# Expose the port the app will run on
EXPOSE 3072

# Start the Node server
CMD ["npm", "start"]
