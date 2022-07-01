function errors(req, res, next, schema) {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if(error) {
        return res.status(422).send(error)
    }

    next()
}

export { errors }