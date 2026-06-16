const config = {
    dev:{
        host:process.env.REACT_APP_SERVER_HOST,
        port:process.env.REACT_APP_SERVER_PORT,
        cloudinary_image_endpoint:process.env.REACT_APP_CLOUDINARY_IMAGE_ENDPOINT,
        serverEndpoint: function () {return `http://localhost:3001`}
        // serverEndpoint: function () {return `${this.host}`}
    }
}

export const env = config['dev'] 