# Stage 1: Build the React app
FROM node:14 as builder

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Create a lightweight Nginx container to serve the built React app
FROM nginx:alpine

# Set environment variables (replace with your actual values)
ENV REACT_APP_SERVER_HOST=localhost
ENV REACT_APP_SERVER_PORT=3001

# Copy the built React app from the previous stage
COPY --from=builder /app/build /usr/share/nginx/html

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d

# Expose port 80 to access the React app
EXPOSE 80

# Start Nginx server in the foreground
CMD ["nginx", "-g", "daemon off;"]
