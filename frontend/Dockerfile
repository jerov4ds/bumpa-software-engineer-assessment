FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose the development server port
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev"]
