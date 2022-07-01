import { ObjectId } from "mongodb"

async function foundRecord(req, res, next) {
    const recordId = req.params.id
    const { db } = res.locals

    const recordFounded = await db.collection('records').findOne({ _id: ObjectId(recordId) })

    if(recordFounded === null) {
        return res.status(404).send('record not found')
    }

    res.locals.recordFounded = recordFounded
    res.locals.recordId = recordId

    next()
}

export { foundRecord }