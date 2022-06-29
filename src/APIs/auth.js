import mongoClient from "../configs/db.js"
import { ObjectId } from 'mongodb'
import { userSchema, loginSchema } from "../validations/auth.js"
import jwt from 'jsonwebtoken'

async function signUp(req, res) {
    const { name, email, password } = req.body

    try {
        const { error } = userSchema.validate(req.body, { abortEarly: false })

        if(error) {
            return res.status(422).send(error)
        }

        await mongoClient.connect()
        const db = mongoClient.db('my_wallet')
    
        const emailFounded = await db.collection('users').findOne({ email })
    
        if(emailFounded !== null) {
            return res.status(409).send('email already registered!')
        }

        await db.collection('users').insertOne({ name, email, password, balance: 0.00 })

        res.sendStatus(201)
    } catch(err) {
        res.status(500).send(err)
    }
}

async function signIn(req, res) {
    const { email, password } = req.body

    try {
        const { error } = loginSchema.validate(req.body, { abortEarly: false })

        if(error) {
            return res.status(422).send(error)
        }

        await mongoClient.connect()
        const db = mongoClient.db('my_wallet')
    
        const userFounded = await db.collection('users').findOne({ email })
    
        if(userFounded === null || userFounded.password !== password) {
            return res.status(401).send('email/password incorrect or email not founded')
        } 

        const token = jwt.sign({ id: userFounded._id }, 'secret')

        res.status(200).json({ name: userFounded.name, email, token })
    } catch(err) {
        res.status(500).send(err)
    }
}

async function userBalanceGET(req, res) {
    const token = req.headers.authorization.replace('bearer ', '')
    const { id } = jwt.verify(token, 'secret')

    if (!token || !id) {
        return res.status(401).send('Unauthorized, missing token')
    }
    
    try {
        await mongoClient.connect()
        const db = mongoClient.db('my_wallet')
        
        const userFounded = await db.collection('users').findOne({ _id: ObjectId(id) })

        if(userFounded === null) {
            return res.status(404).send('user not found')
        }

        res.status(200).json({ balance: userFounded.balance })
    } catch (err) {
        res.status(500).send(err)
    }
}

export { signUp, signIn, userBalanceGET }