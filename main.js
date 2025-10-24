import express from 'express'
import singleRoute_Router from './routes/singleRoute.js'

const app = express()
const PORT = process.env.PORT


// middleware
app.use(express.json())

// routes
app.use('/single-route', singleRoute_Router)

app.listen(PORT, ()=>{
    console.log(`app listening on port: ${PORT}`)
    console.log(`http://localhost:${PORT}`)
})