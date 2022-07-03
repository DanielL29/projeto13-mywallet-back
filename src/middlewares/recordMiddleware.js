import { ObjectId } from "mongodb"
import db from './../database/connect.js'

async function foundRecord(req, res, next) {
    const recordId = req.params.id

    const recordFounded = await db.collection('records').findOne({ _id: ObjectId(recordId) })

    if(recordFounded === null) {
        return res.status(404).send('registro não encontrado')
    }

    res.locals.recordFounded = recordFounded
    res.locals.recordId = recordId

    next()
}

export { foundRecord }