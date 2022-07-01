import jwt from 'jsonwebtoken'

async function validateToken(req, res, next) {
    const token = req.headers.authorization.replace('bearer ', '')
    let decoded;
    
    try {
        decoded = jwt.verify(token, 'secret')
    } catch (err) {
        return res.status(401).send(err)
    }

    const id = decoded.id

    if (!token || !id) {
        return res.status(401).send('unauthorized, missing token')
    }

    res.locals.id = id

    next()
}

export { validateToken }