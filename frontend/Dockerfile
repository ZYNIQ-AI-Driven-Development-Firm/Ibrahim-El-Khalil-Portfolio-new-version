# Multi-stage build for React app
# Stage 1: Build the React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy .env file if it exists (for local builds)
COPY .env* ./

# Copy source code
COPY . .

# Accept build arguments
ARG GEMINI_API_KEY
ARG REACT_APP_BACKEND_URL
# Use build args if provided, otherwise use .env file
ENV REACT_APP_GEMINI_API_KEY=${GEMINI_API_KEY:-}
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL:-}

# Build the app
RUN npm run build

# Stage 2: Serve the built app with nginx
FROM nginx:alpine

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]