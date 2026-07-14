const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const { protect, restrictTo } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { productValidation } = require('../utils/validators')

// Public routes
router.get('/', productController.getProducts)
router.get('/stats', productController.getProductStats)
router.get('/category/:category', productController.getProductsByCategory)
router.get('/:id', productController.getProduct)

// Protected routes
router.use(protect)
router.use(restrictTo('admin', 'superadmin'))

router.post('/',
    validate(productValidation.create),
    productController.createProduct
)

router.patch('/:id',
    validate(productValidation.update),
    productController.updateProduct
)

router.delete('/:id', productController.deleteProduct)

// Bulk operations
router.post('/bulk', productController.bulkCreateProducts)
router.delete('/bulk', productController.bulkDeleteProducts)

module.exports = router