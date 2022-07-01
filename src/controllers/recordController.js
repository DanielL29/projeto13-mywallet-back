import { ObjectId } from 'mongodb'
import dayjs from 'dayjs'

async function recordsGET(req, res) {
    let balance;
    const { id, db } = res.locals

    try {
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
    const { id, db } = res.locals
    let { price } = req.body

    try {
        if (!isIncrease) price *= -1
        
        const record = { price, description, isIncrease, date: dayjs().format('DD/MM'), userId: id }
        await db.collection('records').insertOne(record)

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err)
    }
}

async function recordsPUT(req, res) {
    const { description, isIncrease } = req.body
    const { recordFounded, recordId, db } = res.locals
    let { price } = req.body

    try {
        if (!isIncrease) price *= -1

        const record = { price, description, isIncrease, date: recordFounded.date, userId: recordFounded.userId }
        await db.collection('records').updateOne({ _id: ObjectId(recordId) }, { $set: record })

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err)
    }
}

async function recordsDELETE(req, res) {
    const { recordId, db } = res.locals
    
    try {
        await db.collection('records').deleteOne({ _id: ObjectId(recordId) })
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err)
    }
}

export { recordsGET, recordsPOST, recordsDELETE, recordsPUT }