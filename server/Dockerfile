# Stage 1: Build the React app
FROM node:14 as builder

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ENV PORT=3001
ENV SERVER_HOST=localhost
ENV MONGO_URI=mongodb+srv://sajjad:sajjad@cluster0.thltkdn.mongodb.net/my_socio_db
ENV JWT_SECRET=abniaufh
ENV CLIENT_URL=http://localhost:3000
ENV CLOUDINARY_CLOUD_NAME=dboic3hiu
ENV CLOUDINARY_API_KEY=286475136881262
ENV CLOUDINARY_API_SECRET=RIfn9xU1NNmB9Jd68CQH8l9CTEU

EXPOSE 3001

CMD ["npm", "start"]
