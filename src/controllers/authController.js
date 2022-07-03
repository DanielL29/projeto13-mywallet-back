import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from './../database/connect.js'

async function signUp(req, res) {
    const { name, email, password } = req.body
    const hashPassword = bcrypt.hashSync(password, 10)

    try {
        const emailFounded = await db.collection('users').findOne({ email })
    
        if(emailFounded !== null) {
            return res.status(409).send('email já cadastrado!')
        }

        await db.collection('users').insertOne({ name, email, password: hashPassword })

        res.sendStatus(201)
    } catch(err) {
        res.status(500).send(err)
    }
}

async function signIn(req, res) {
    const { email, password } = req.body

    try {
        const userFounded = await db.collection('users').findOne({ email })
    
        if(!userFounded || !bcrypt.compareSync(password, userFounded.password)) {
            return res.status(401).send('email/senha incorreto ou email não encontrado')
        } 

        const token = jwt.sign({ id: userFounded._id }, 'secret', { expiresIn: '30m' })

        res.status(200).json({ name: userFounded.name, token })
    } catch(err) {
        res.status(500).send(err)
    }
}

export { signUp, signIn }