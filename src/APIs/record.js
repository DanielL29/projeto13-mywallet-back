import mongoClient from "../configs/db.js"
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { recordSchema } from "../validations/record.js"
import dayjs from 'dayjs'

async function recordsGET(req, res) {
    const token = req.headers.authorization.replace('bearer ', '')
    const { id } = jwt.verify(token, 'secret')
    let balance;

    if (!token || !id) {
        return res.status(401).send('unauthorized, missing token')
    }

    try {
        await mongoClient.connect()
        const db = mongoClient.db('my_wallet')

        const userFounded = await db.collection('users').findOne({ _id: ObjectId(id) })

        if(userFounded === null) {
            return res.status(404).send('user not found')
        }

        const records = await db.collection('records').find({ userId: id }).toArray()
        await db.collection('records').aggregate([
            { $match: { userId: id } }, 
            { $group: { _id: null, sum: { $sum: "$price" } } }
        ]).forEach(item => balance = item)

        res.status(200).send({ records, balance })
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

        const record = { price, description, isIncrease, date: dayjs().format('DD/MM'), userId: id }
        const { error } = recordSchema.validate(record, { abortEarly: false })

        if (error) {
            return res.status(422).send(error)
        }

        await db.collection('records').insertOne(record)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err)
    }
}

async function recordsPUT(req, res) {
    const recordId = req.params.id
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

        const recordFounded = await db.collection('records').findOne({ _id: ObjectId(recordId) })

        if(recordFounded === null) {
            return res.status(404).send('record not found')
        }

        const record = { price, description, isIncrease, date: recordFounded.date, userId: recordFounded.userId }
        const { error } = recordSchema.validate(record, { abortEarly: false })

        if (error) {
            return res.status(422).send(error)
        }

        await db.collection('records').updateOne({ _id: ObjectId(recordId) }, { $set: record })
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err)
    }
}

async function recordsDELETE(req, res) {
    const recordId = req.params.id
    const token = req.headers.authorization.replace('bearer ', '')
    const { id } = jwt.verify(token, 'secret')

    if (!token || !id) {
        return res.status(401).send('Unauthorized, missing token')
    }
    
    try {
        await mongoClient.connect()
        const db = mongoClient.db('my_wallet')

        const idFounded = await db.collection('records').findOne({ _id: ObjectId(recordId), userId: id })

        if(idFounded === null) {
            return res.status(404).send('record not found')
        }

        await db.collection('records').deleteOne({ _id: ObjectId(recordId) })
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err)
    }
}

export { recordsGET, recordsPOST, recordsDELETE, recordsPUT }