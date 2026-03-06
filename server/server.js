import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controller/webhooks.js';

//initialize express
const app=express()

//connect to database
await connectDB()

//middlewares
app.use(cors())

//routes
app.get('/', (req,res)=> res.send("API Working"))
app.post('/clerk', express.json(), clerkWebhooks)

//port
const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})