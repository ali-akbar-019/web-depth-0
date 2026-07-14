const Joi = require('joi')

// ---------- USER VALIDATION ----------
const userValidation = {
    register: Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'Name must be at least 2 characters',
                'string.max': 'Name cannot exceed 50 characters',
                'any.required': 'Name is required'
            }),
        
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email',
                'any.required': 'Email is required'
            }),
        
        password: Joi.string()
            .min(6)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .required()
            .messages({
                'string.min': 'Password must be at least 6 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                'any.required': 'Password is required'
            }),
        
        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords do not match',
                'any.required': 'Confirm password is required'
            })
    }),
    
    login: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email',
                'any.required': 'Email is required'
            }),
        
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required'
            })
    }),
    
    update: Joi.object({
        name: Joi.string()
            .min(2)
            .max(50),
        
        email: Joi.string()
            .email(),
        
        role: Joi.string()
            .valid('user', 'admin', 'superadmin')
    }),
    
    changePassword: Joi.object({
        currentPassword: Joi.string()
            .required()
            .messages({
                'any.required': 'Current password is required'
            }),
        
        newPassword: Joi.string()
            .min(6)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .required()
            .messages({
                'string.min': 'New password must be at least 6 characters',
                'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
                'any.required': 'New password is required'
            }),
        
        confirmPassword: Joi.string()
            .valid(Joi.ref('newPassword'))
            .required()
            .messages({
                'any.only': 'Passwords do not match',
                'any.required': 'Confirm password is required'
            })
    })
}

// ---------- PRODUCT VALIDATION ----------
const productValidation = {
    create: Joi.object({
        name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.min': 'Product name must be at least 2 characters',
                'string.max': 'Product name cannot exceed 100 characters',
                'any.required': 'Product name is required'
            }),
        
        description: Joi.string()
            .max(1000)
            .required()
            .messages({
                'string.max': 'Description cannot exceed 1000 characters',
                'any.required': 'Description is required'
            }),
        
        price: Joi.number()
            .min(0)
            .required()
            .messages({
                'number.min': 'Price cannot be negative',
                'any.required': 'Price is required'
            }),
        
        discountPrice: Joi.number()
            .min(0),
        
        category: Joi.string()
            .valid('electronics', 'clothing', 'books', 'food', 'other')
            .required()
            .messages({
                'any.only': 'Invalid category',
                'any.required': 'Category is required'
            }),
        
        brand: Joi.string()
            .trim(),
        
        stock: Joi.number()
            .min(0)
            .default(0)
            .messages({
                'number.min': 'Stock cannot be negative'
            }),
        
        features: Joi.array()
            .items(
                Joi.object({
                    key: Joi.string().required(),
                    value: Joi.string().required()
                })
            ),
        
        tags: Joi.array()
            .items(Joi.string()),
        
        isPublished: Joi.boolean()
            .default(true)
    }),
    
    update: Joi.object({
        name: Joi.string()
            .min(2)
            .max(100),
        
        description: Joi.string()
            .max(1000),
        
        price: Joi.number()
            .min(0),
        
        discountPrice: Joi.number()
            .min(0),
        
        category: Joi.string()
            .valid('electronics', 'clothing', 'books', 'food', 'other'),
        
        brand: Joi.string()
            .trim(),
        
        stock: Joi.number()
            .min(0),
        
        features: Joi.array()
            .items(
                Joi.object({
                    key: Joi.string().required(),
                    value: Joi.string().required()
                })
            ),
        
        tags: Joi.array()
            .items(Joi.string()),
        
        isPublished: Joi.boolean()
    })
}

// ---------- QUERY VALIDATION ----------
const queryValidation = {
    pagination: Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1),
        
        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10),
        
        sort: Joi.string()
            .valid('asc', 'desc')
            .default('desc'),
        
        sortBy: Joi.string()
            .default('createdAt')
    }),
    
    filter: Joi.object({
        category: Joi.string(),
        brand: Joi.string(),
        minPrice: Joi.number().min(0),
        maxPrice: Joi.number().min(0),
        inStock: Joi.boolean(),
        search: Joi.string()
    })
}

module.exports = {
    userValidation,
    productValidation,
    queryValidation
}