import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import singleRoute_Router from './routes/singleRoute.js'
import docs_router from './routes/docs.js'


const app = express()
const PORT = process.env.PORT


// middleware
app.use(express.json())

// routes
app.use('/docs', docs_router);
app.use('/api/single-route', singleRoute_Router)

app.listen(PORT, ()=>{
    console.log(`app listening on port: ${PORT}`)
    console.log(`http://localhost:${PORT}`)
})