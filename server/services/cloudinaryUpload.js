import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/config.js';
import { fileURLToPath } from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
    cloud_name: env.cloudinary_cloud_name,
    api_key: env.cloudinary_api_key,
    api_secret: env.cloudinary_api_secret
});

export const uploadd = ()=>{
    cloudinary.uploader.upload(path.resolve(__dirname, '../public/assets/adog2.jpg'), (err, result)=>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
        }
    })
}
