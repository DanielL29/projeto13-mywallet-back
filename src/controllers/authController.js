import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

async function signUp(req, res) {
    const { name, email, password } = req.body
    const { db } = res.locals
    const hashPassword = bcrypt.hashSync(password, 10)

    try {
        const emailFounded = await db.collection('users').findOne({ email })
    
        if(emailFounded !== null) {
            return res.status(409).send('email already registered!')
        }

        await db.collection('users').insertOne({ name, email, password: hashPassword })

        res.sendStatus(201)
    } catch(err) {
        res.status(500).send(err)
    }
}

async function signIn(req, res) {
    const { email, password } = req.body
    const { db } = res.locals

    try {
        const userFounded = await db.collection('users').findOne({ email })
    
        if(!userFounded || !bcrypt.compareSync(password, userFounded.password)) {
            return res.status(401).send('email/password incorrect or email not founded')
        } 

        const token = jwt.sign({ id: userFounded._id }, 'secret', { expiresIn: '1m' })

        res.status(200).json({ name: userFounded.name, email, token })
    } catch(err) {
        res.status(500).send(err)
    }
}

export { signUp, signIn }