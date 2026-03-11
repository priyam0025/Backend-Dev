import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))

app.use(express.json({limit: "16kb"})) //says I am excepting the json(s) ,limits cab be set 
app.use(express.urlencoded({extended: true, limit: "16kb"})) //data can come from urls
app.use(express.static("public")) //to store the images, favicon etc
app.use(cookieParser()) // to access and modify cookies from the user's browser from server

export { app }