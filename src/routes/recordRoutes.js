import express from 'express'
import { recordsGET, recordsPOST, recordsDELETE, recordsPUT } from '../controllers/recordController.js'
import { errors } from '../middlewares/errorMiddleware.js'
import { foundRecord } from '../middlewares/recordMiddleware.js'
import { validateToken } from '../middlewares/tokenMiddleware.js'
import { recordSchema } from '../validations/recordValidation.js'

const router = express.Router()

router.get('/records', 
    validateToken, 
    recordsGET
)
router.post('/records', 
    validateToken, 
    (req, res, next) => errors(req, res, next, recordSchema), 
    recordsPOST
)
router.put('/records/:id', 
    validateToken, 
    (req, res, next) => errors(req, res, next, recordSchema), 
    foundRecord, 
    recordsPUT
)
router.delete('/records/:id', 
    validateToken, 
    foundRecord, 
    recordsDELETE
)

export default router