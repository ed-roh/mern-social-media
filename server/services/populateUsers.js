import User from '../models/User.js'
import { users } from '../data/index.js'

export const pushUsersToDB = async (req, res)=>{
    const resp = await User.insertMany(users)
    res.send("done")
}