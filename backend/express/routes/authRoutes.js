const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { userValidation } = require('../utils/validators')

// Public routes
router.post('/register', validate(userValidation.register), authController.register)
router.post('/login', validate(userValidation.login), authController.login)

// Password reset
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)

// Protected routes
router.post('/logout', protect, authController.logout)
router.post('/change-password', protect, validate(userValidation.changePassword), authController.changePassword)
router.post('/refresh-token', authController.refreshToken)

module.exports = router