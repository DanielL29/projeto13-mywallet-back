import Joi from 'joi'

const userSchema = Joi.object({
    name: Joi.string()
        .messages({
            "string.empty": `"name" não pode ser vazio`,
            "any.required": `"name" é obrigatório!`
        })
        .required(),
    email: Joi.string()
        .pattern(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/)
        .messages({
            "string.pattern.base": `"email" precisa conter @ e um . ex: @example.com`,
            "string.empty": `"email" não pode ser vazio`,
            "any.required": `"email" é obrigatório!`
        })
        .required(),
    password: Joi.string()
        .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%&*]{8,}$/)
        .message({
            "string.pattern.base": `"password" precisa conter 1 letra maiuscula, 1 numero e pelo menos 8 caracteres`,
            "string.empty": `"password" não pode ser vazio`,
            "any.required": `"password" é obrigatório!`
        })
        .required(),
    confirmPassword: Joi.any()
        .messages({
            "any.only": `"confirmPassword" precisa ser igual a senha passada`,
            "string.empty": `"confirmPassword" não pode ser vazio`,
            "any.required": `"confirmPassword" é obrigatório!`
        })
        .valid(Joi.ref('password'))
        .required()
})

const loginSchema = Joi.object({
    email: Joi.string()
        .pattern(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/)
        .messages({
            "string.pattern.base": `"email" precisa conter @ e um . ex: @example.com`,
            "string.empty": `"email" não pode ser vazio`,
            "any.required": `"email" é obrigatório!`
        })
        .required(),
    password: Joi.string()
        .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%&*]{8,}$/)
        .message({
            "string.pattern.base": `"password" precisa conter 1 letra maiuscula, 1 numero e pelo menos 8 caracteres`,
            "string.empty": `"password" não pode ser vazio`,
            "any.required": `"password" é obrigatório!`
        })
        .required()
})

export { userSchema, loginSchema }