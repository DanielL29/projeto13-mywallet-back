import Joi from 'joi'

const recordSchema = Joi.object({
    price: Joi.number()
        .required(),
    description: Joi.string()
        .required(),
    isIncrease: Joi.bool()
        .required(),
    userId: Joi.string()
        .required()
})

export { recordSchema }