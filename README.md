# FullStack Social Media App

Complete React MERN Full Stack Social Media App

For users who are looking to contribute, I'm planning to possibly create a separate branch for community contributions and additional features as well as for improvements and fixes.

I haven't decided on the exact workflow I'll be using yet. But we'll get it out there soon!

# How to start [Tutorial after installing node]

1. Copy the `server/.env.example` file to generate the `server/.env` file.
2. Go to [mongodb](https://www.mongodb.com/) to register and log in to create MongoDB database.
3. After the last step, copy your MongoDB link address and replace the `.env` file `MONGO_URL` field, please replace `<password>` with the correct password you set.
4. Comment out lines 66 and 67 of `server/index.js` file at the first startup.
5. Enter the server directory, install and start the service

```bash
cd server
npm install
npm run start
```
