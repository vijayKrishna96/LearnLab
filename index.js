require('dotenv').config();

const cors = require('cors')
const express = require('express')
const { connectDB } = require('./config/database.js')
const cookieParser = require('cookie-parser')

const userRoute = require('./routes/userRoute.js')
const courseRoute = require('./routes/courseRoute.js')
const reviewRoute = require('./routes/reviewRoute.js')
const cartRoute = require('./routes/cartRoute.js')
const categoryRoute = require('./routes/categoryRoute.js')

const app = express()
const port = process.env.PORT

connectDB();

app.use(cors({
    credentials: true,
    origin: true
  }))
  
  app.use(express.json())
  app.use(cookieParser())

app.use('/user', userRoute)
app.use('/course', courseRoute)
app.use('/review', reviewRoute)
app.use('/cart', cartRoute)
app.use('/category', categoryRoute)


app.listen(port , ()=> {
    console.log(`App Listening on port ${port}`)
})