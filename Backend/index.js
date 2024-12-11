const express = require('express')
require('dotenv').config();
const connectdb = require('./Database_connection/db.js')
const router = require('./Routes/RegisterRoutes.js')
const Reciperoutes = require('./Routes/RecipeRouter.js')
const path = require('path')
const cors = require('cors')

const app=express();
app.use(cors({
    origin: process.env.APPLICATION_URL
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api',router)
app.use('/api',Reciperoutes)
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
connectdb();

const PORT = process.env.PORT
app.listen(PORT, ()=>
console.log(`server running on PORT ${PORT}`));