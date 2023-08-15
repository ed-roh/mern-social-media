import express from "express";
import http from "http"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
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
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import conversationRouter from './routes/conversations.js'
import messageRouter from './routes/messages.js'

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const server = http.createServer(app)

//creating an io instance
const clientURL=process.env.CLIENT_URL
const io = new Server(server, {
  cors: {
    origin: "*",
  }
})

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
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
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
