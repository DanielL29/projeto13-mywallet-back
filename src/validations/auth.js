import Joi from 'joi'

const userSchema = Joi.object({
    name: Joi.string()
        .required(),
    email: Joi.string()
        .pattern(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/)
        .message('"email" must have @ character and .')
        .required(),
    password: Joi.string()
        .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
        .message('"password" must have at least one uppercase letter and one number')
        .required(),
    confirmPassword: Joi.ref('password')
})

export { userSchema }