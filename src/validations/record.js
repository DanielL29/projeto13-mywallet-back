import Joi from 'joi'

const recordSchema = Joi.object({
    price: Joi.number()
        .messages({
            "number.empty": `"price" não pode ser vazio`,
            "any.required": `"price" é obrigatório!`
        })
        .required(),
    description: Joi.string()
        .messages({
            "string.empty": `"description" não pode ser vazio`,
            "any.required": `"description" é obrigatório!`
        })
        .required(),
    isIncrease: Joi.bool()
        .messages({
            "boolean.base": `"isIncrease" precisa ser booleano`,
            "any.required": `"isIncrease" é obrigatório!`
        })
        .required(),
    date: Joi.string()
        .required(),
    userId: Joi.string()
        .required()
})

export { recordSchema }