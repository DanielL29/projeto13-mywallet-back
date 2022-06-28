import mongoClient from "../configs/db.js"
import { recordSchema } from "../validations/record.js"

async function recordsGET(req, res) {
    try {
        await mongoClient.connect()
        const db = mongoClient.db('my_wallet')

        const records = await db.collection('records').find().toArray()

        res.status(200).send(records)
    } catch(err) {
        res.status(500).send(err)
    }
}

async function recordPOST(req, res) {

}

export { recordsGET, recordPOST }