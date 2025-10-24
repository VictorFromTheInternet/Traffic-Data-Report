import express from 'express'
import singleRouteController from '../controllers/singleRouteController.js'
const router = express.Router()


router.get('/health-check',(req,res)=>{

    res.send({"message":"Hello World!"})
})

router.post('/', singleRouteController)


export default router