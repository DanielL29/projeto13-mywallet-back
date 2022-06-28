import mongoClient from "../configs/db.js"
import { userSchema } from "../validations/auth.js"

async function signup(req, res) {
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

async function signin(req, res) {

}

export { signup, signin }