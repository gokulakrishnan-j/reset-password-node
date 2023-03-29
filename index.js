import express from "express"
import jwt from "jsonwebtoken"
import { MongoClient } from "mongodb"
import * as dotenv from "dotenv"
dotenv.config()
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import cors from "cors"
import UserRouter from "./routers/user.route.js"

const app = express()

const PORT = process.env.PORT

const MONGO_URL = process.env.MONGO_URL
const client = new MongoClient(MONGO_URL)
await client.connect()

app.use(cors())
app.use(express.json())

app.use("/user",UserRouter)

app.listen(PORT)

export {jwt,bcrypt,client,nodemailer}