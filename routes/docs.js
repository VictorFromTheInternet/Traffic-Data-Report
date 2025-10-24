import express from 'express'
const router = express.Router()
import fs from 'fs/promises'
import swaggerUi from 'swagger-ui-express'

const swaggerConfig = JSON.parse(await fs.readFile(new URL('../config/swagger.json', import.meta.url), 'utf-8'))

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerConfig ));

export default router