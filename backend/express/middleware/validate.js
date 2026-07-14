const AppError = require("../utils/AppError")

// 1. joi validation middleware
const validate = (schema)=>{
    return (req, res, next)=>{
        const {error} = schema.validate(req.body,{
            abortEarly: false,
            stripUnknown: true, //unknown fields remove karo
        })
        // 
        if(error){
            const errors = error.details.map(detail=>({
                field: detail.path[0],
                message: detail.message
            }))
            return next(new AppError("Validation Failed", 422, errors))
        }
        next()
    }
}
// 2. Query validation middleware
const validateQuery = (schema)=>{
    return (req, res, next)=>{
        const {error} = schema.validate(req.query,{
            abortEarly: false
        })

        if(error){
            const errors = error.details.map(detail=>({
                field: detail.path[0],
                message: detail.message

            }))
            return next(new AppError("Invalid query parameters", 422, errors))
        }
        next()
    }
}

// 3. params validation
const validateParams = (schema)=>{
    return (req, res, next)=>{
        const {errors} = schema.validate(req.params, {
            abortEarly: false
        
        })
        if(error){
            const errors = error.details.map(detail=>({
                field: detail.path[0],
                message: detail.message

            }))
            return next(new AppError("Invalid URL parameters", 422, errors))
        }
        next()
    }
}

module.exports = {
    validate, 
    validateQuery,
    validateParams
}