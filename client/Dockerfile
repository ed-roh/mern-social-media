FROM node:16-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

# ENV REACT_APP_SERVER_HOST=https://socio-service.onrender.com
ENV REACT_APP_SERVER_HOST=https://socio-service.onrender.com
ENV REACT_APP_SERVER_PORT=3001
ENV REACT_APP_CLOUDINARY_IMAGE_ENDPOINT=https://res.cloudinary.com/dboic3hiu/image/upload/v1696227469/

COPY . .

EXPOSE 3000

CMD ["npm", "start"]