import express from 'express'
import { userSchema, loginSchema } from "../validations/authValidation.js"
import { signUp, signIn } from '../controllers/authController.js'
import { errors } from '../middlewares/errorMiddleware.js'
import { connectDatabase } from '../middlewares/mongoMiddleware.js'

const router = express.Router()

router.post('/sign-up', 
    (req, res, next) => errors(req, res, next, userSchema), 
    connectDatabase, 
    signUp
)
router.post('/sign-in', 
    (req, res, next) => errors(req, res, next, loginSchema), 
    connectDatabase, 
    signIn
)

export default router