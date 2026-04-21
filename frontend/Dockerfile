# Use a Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port (Vite default is 5173)
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]
