# Use Node.js 20 as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the Vite app
RUN npm run build

# Install a static server to serve the built files
RUN npm install -g serve

# Expose port 5173
EXPOSE 5173

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "5173"]