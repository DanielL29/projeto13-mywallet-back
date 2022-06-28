import mongoClient from "../configs/db.js"
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { recordSchema } from "../validations/record.js"

async function recordsGET(req, res) {
    try {
        await mongoClient.connect()
        const db = mongoClient.db('my_wallet')

        const records = await db.collection('records').find().toArray()

        res.status(200).send(records)
    } catch (err) {
        res.status(500).send(err)
    }
}

async function recordsPOST(req, res) {
    const { description, isIncrease } = req.body
    let { price } = req.body

    const token = req.headers.authorization.replace('bearer ', '')
    const { id } = jwt.verify(token, 'secret')

    if (!token || !id) {
        return res.status(401).send('Unauthorized, missing token')
    }

    try {
        await mongoClient.connect()
        const db = mongoClient.db('my_wallet')

        if (!isIncrease) {
            price *= -1
        }

        const record = { price, description, isIncrease, userId: id }

        const { error } = recordSchema.validate(record, { abortEarly: false })

        if (error) {
            return res.status(422).send(error)
        }

        await db.collection('records').insertOne(record)
        updateUserBalance(id)

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err)
    }
}

async function updateUserBalance(id) {
    await mongoClient.connect()
    const db = mongoClient.db('my_wallet')
    let balance;

    await db.collection('records').aggregate([
        { $match: { userId: id } }, 
        { $group: { _id: null, sum: { $sum: "$price" } } }
    ]).forEach(item => balance = item)

    if(balance.sum) {
        await db.collection('users').updateOne({ _id: ObjectId(id) }, { $set: { balance: balance.sum } })
    }
}

export { recordsGET, recordsPOST }