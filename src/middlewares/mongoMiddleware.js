import mongoClient from '../configs/db.js'

async function connectDatabase(req, res, next) {
    await mongoClient.connect()
    const db = mongoClient.db('my_wallet')

    res.locals.db = db

    next()
}

export { connectDatabase }