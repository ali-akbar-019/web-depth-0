const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { protect, restrictTo } = require('../middleware/auth')
const { validate, validateQuery } = require('../middleware/validate')
const { userValidation, queryValidation } = require('../utils/validators')
const { uploadSingle } = require('../middleware/upload')

// All routes need authentication
router.use(protect)

// Current user routes
router.get('/me', userController.getMe)
router.patch('/me', validate(userValidation.update), userController.updateProfile)
router.post('/me/avatar', uploadSingle, userController.uploadAvatar)

// Admin only routes
router.use(restrictTo('admin', 'superadmin'))

router.get('/',
    validateQuery(queryValidation.pagination),
    userController.getUsers
)
router.get('/:id', userController.getUser)
router.patch('/:id', validate(userValidation.update), userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router