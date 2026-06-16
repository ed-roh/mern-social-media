import express from "express";
import http from "http"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { Server } from "socket.io";
import User from "./models/User.js";
import conversationRouter from './routes/conversations.js'
import messageRouter from './routes/messages.js'
import { env } from "./config/config.js";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// dotenv.config();
const app = express();
const server = http.createServer(app)

//creating an io instance
// const clientURL= env.client_url
const io = new Server(server, {
  cors: {
    origin: "*",
  }
})
// uploadd();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/assets");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
cloudinary.config({
  cloud_name: env.cloudinary_cloud_name,
  api_key: env.cloudinary_api_key,
  api_secret: env.cloudinary_api_secret
});

const storage = new CloudinaryStorage({
  cloudinary,
  params:{
    folder:"dps"
  }
})
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/conversations", conversationRouter)
app.use("/messages", messageRouter)


/* SOCKET IO SETUP */
io.on('connection', (socket) => {

  socket.on("new-user", (userId)=>{
    addNewUser(socket.id, userId)
    socket.emit("is-online", onlienUsers.map(user=>user.userId))
    console.log("new user", onlienUsers)
  })

  socket.on("send-notification", async ({senderId, receiverId, type})=>{
    const receiver = getOnlineUser(receiverId)
    const user = await User.findById(senderId)
    if (!receiver) return
    io.to(receiver.socketId).emit("get-notification", {userName:user.firstName, type})
  })

  socket.on("send-message", ({receiverId, data})=>{
    console.log("online>>>>",onlienUsers) 
    const receiver = getOnlineUser(receiverId)
    if(!receiver) return
    io.to(receiver.socketId).emit("get-message", data)
    io.to(receiver.socketId).emit("message-seen", {msgId:data._id})
  })
  socket.on("is-typing", ({typing, receiverId})=>{
    const receiver = getOnlineUser(receiverId)
    if(!receiver) return
    io.to(receiver.socketId).emit("start-typing", {typing})
  })

  socket.on("not-typing", ({typing, receiverId})=>{
    const receiver = getOnlineUser(receiverId)
    if(!receiver) return;
    io.to(receiver.socketId).emit("stop-typing", {typing})
  })

  socket.on("send-seen", ({seen, receiverId})=>{
    console.log(seen, receiverId)
    const receiver = getOnlineUser(receiverId)
    if(!receiver) return;
    io.to(receiver.socketId).emit("get-seen", {seen})
  })

  socket.on("send-newMsg-count", ({receiverId})=>{
    const receiver = getOnlineUser(receiverId)
    if(!receiver) return;
    io.to(receiver.socketId).emit("get-newMsg-count", {isNewMsg:true})
  })

  socket.on('disconnect', () => {
    removeUser(socket.id)
    socket.emit("is-online", onlienUsers.map(user=>user.userId))
    console.log('user disconnected');
  });
});

// functions used by socket io
let onlienUsers = [];
const addNewUser = (socketId, userId)=>{
  !onlienUsers.some(el=> el.userId === userId) && onlienUsers.push({socketId, userId});
}
const removeUser = (socketId) => {
  onlienUsers = onlienUsers.filter(el=> el.socketId !== socketId);
}
const getOnlineUser = (userId)=>{
  return onlienUsers.find(el=> el.userId === userId);
}



/* MONGOOSE SETUP */
const PORT = env.PORT || 3001;
mongoose.set('strictQuery', true)
mongoose
  .connect(env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));


// module.exports.handler = ServerlessHttp(server)