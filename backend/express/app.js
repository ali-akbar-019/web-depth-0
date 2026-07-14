const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

const AppError = require('./utils/AppError')
const errorHandler = require('./middleware/errorHandler')

// Import routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')

const app = express()

// ---------- SECURITY MIDDLEWARE ----------
// Helmet - Security headers
app.use(helmet())

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
}))

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests from this IP, please try again later'
})
app.use('/api', limiter)

// ---------- LOGGING ----------
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
} else {
    app.use(morgan('combined'))
}

// ---------- BODY PARSING ----------
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// XSS protection
app.use(xss())

// ---------- STATIC FILES ----------
app.use('/uploads', express.static('uploads'))

// ---------- ROUTES ----------
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            products: '/api/products'
        }
    })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)

// ---------- 404 HANDLER ----------
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// ---------- GLOBAL ERROR HANDLER ----------
app.use(errorHandler)

module.exports = app