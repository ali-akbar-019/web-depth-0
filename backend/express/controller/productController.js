const Product = require("../models/Product")
const AppError = require("../utils/AppError")
const asyncHandler = require("../utils/asyncHandler")
const { productValidation } = require("../utils/validators")


// create product
exports.createProduct = asyncHandler(async (req, res) => {
    // STEP 1: VALIDATE
    // Kya: User ne sahi data bheja?
    const { error } = productValidation.create.validate(req.body)
    if (error) {
        throw new AppError(error.details[0].message, 400)
    }
    // Example: price negative hai → "Price cannot be negative"

    // STEP 2: CREATE PRODUCT
    // Product model ki create method use karo
    const product = await Product.create(req.body)
    // Database mein insert ho gaya
    // {
    //   _id: "654321...",
    //   name: "iPhone 15",
    //   price: 79999,
    //   category: "electronics",
    //   createdAt: "2024-01-01T10:00:00Z"
    // }

    // STEP 3: SEND RESPONSE
    res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        data: product
    })
})
// all products
exports.getProducts = asyncHandler(async (req, res) => {
    // STEP 1: EXTRACT QUERY PARAMETERS
    const { page, limit, sort, sortBy } = req.query
    // Example: ?page=2&limit=10&sort=asc&sortBy=price

    // STEP 2: BUILD FILTER OBJECT (Important!)
    const filter = {}

    // 2.1: Category Filter
    if (req.query.category) {
        filter.category = req.query.category
    }
    // Example: ?category=electronics → filter = { category: 'electronics' }

    // 2.2: Brand Filter
    if (req.query.brand) {
        filter.brand = req.query.brand
    }
    // Example: ?brand=Apple → filter = { category: 'electronics', brand: 'Apple' }

    // 2.3: Price Range Filter
    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {}
        if (req.query.minPrice) {
            filter.price.$gte = parseInt(req.query.minPrice)  // $gte = greater than or equal
        }
        if (req.query.maxPrice) {
            filter.price.$lte = parseInt(req.query.maxPrice)  // $lte = less than or equal
        }
    }
    // Example: ?minPrice=1000&maxPrice=5000
    // → filter = { price: { $gte: 1000, $lte: 5000 } }

    // 2.4: Stock Filter (In Stock)
    if (req.query.inStock === 'true') {
        filter.stock = { $gt: 0 }
    }
    // Example: ?inStock=true → filter = { stock: { $gt: 0 } }

    // 2.5: Published Status
    filter.isPublished = req.query.published === 'false' ? false : true
    // By default: sirf published products dikhao
    // Admin ke liye: ?published=false → unpublished bhi dikhao

    // 2.6: Text Search
    if (req.query.search) {
        filter.$text = { $search: req.query.search }
    }
    // Example: ?search=iphone → MongoDB text search
    // Note: Product schema mein text index hona chahiye

    // STEP 3: PAGINATION
    const pageNum = parseInt(page) || 1          // Default: page 1
    const limitNum = parseInt(limit) || 10       // Default: 10 items per page
    const skip = (pageNum - 1) * limitNum        // Skip formula

    // Example: page=2, limit=10 → skip = (2-1)*10 = 10
    // Matlab: pehle 10 items chhod ke next 10 laao

    // STEP 4: SORTING
    const sortOrder = sort === 'asc' ? 1 : -1    // 1 = ascending, -1 = descending
    // Example: sort=asc → 1, sort=desc → -1 (default)

    // STEP 5: EXECUTE QUERY
    const products = await Product.find(filter)                    // Apply filters
        .sort({ [sortBy || 'createdAt']: sortOrder })              // Apply sorting
        .skip(skip)                                                 // Skip for pagination
        .limit(limitNum)                                           // Limit items

    // Query explanation:
    // Product.find(filter) → Database mein search
    // .sort({ price: 1 }) → price ke hisaab se ascending
    // .skip(10) → pehle 10 items chhodo
    // .limit(10) → 10 items laao

    // STEP 6: GET TOTAL COUNT (Pagination ke liye)
    const total = await Product.countDocuments(filter)
    const totalPages = Math.ceil(total / limitNum)
    // Example: total=45, limit=10 → totalPages = 5

    // STEP 7: SEND RESPONSE
    res.json({
        status: 'success',
        data: products,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,                    // Total items in database
            totalPages,               // Total pages
            hasNext: pageNum < totalPages,    // Next page hai?
            hasPrev: pageNum > 1              // Previous page hai?
        }
    })
})
// get single product
exports.getProduct = asyncHandler(async (req, res) => {
    // STEP 1: FIND PRODUCT BY ID
    const product = await Product.findById(req.params.id)
    // req.params.id: URL se id milti hai
    // Example: /api/products/654321 → req.params.id = '654321'

    // STEP 2: CHECK IF EXISTS
    if (!product) {
        throw new AppError('Product not found', 404)
    }

    // STEP 3: INCREASE VIEW COUNT (Analytics)
    // Har baar koi product dekhe, views badhao
    product.views = (product.views || 0) + 1
    // Agar views nahi hai toh 0 + 1, warna current + 1
    await product.save({ validateBeforeSave: false })
    // validateBeforeSave: false → validation mat karo (sirf views badha rahe hain)

    // STEP 4: SEND RESPONSE
    res.json({
        status: 'success',
        data: product
    })
})
// update product

exports.updateProduct = asyncHandler(async (req, res) => {
    // STEP 1: VALIDATE
    const { error } = productValidation.update.validate(req.body)
    if (error) {
        throw new AppError(error.details[0].message, 400)
    }

    // STEP 2: FIND AND UPDATE
    const product = await Product.findByIdAndUpdate(
        req.params.id,           // Product ID
        req.body,                // Updates
        {
            new: true,           // Updated document return karo
            runValidators: true  // Schema validations apply karo
        }
    )

    // Explanation:
    // new: true → Without this, purana document return hota
    // runValidators: true → Joi validation ke alawa schema validation bhi chahiye

    // STEP 3: CHECK IF EXISTS
    if (!product) {
        throw new AppError('Product not found', 404)
    }

    // STEP 4: SEND RESPONSE
    res.json({
        status: 'success',
        message: 'Product updated successfully',
        data: product
    })
})

// delete product
exports.deleteProduct = asyncHandler(async (req, res) => {
    // STEP 1: FIND PRODUCT
    const product = await Product.findById(req.params.id)

    // STEP 2: CHECK IF EXISTS
    if (!product) {
        throw new AppError('Product not found', 404)
    }

    // STEP 3: DELETE
    await product.deleteOne()
    // Alternative: await Product.findByIdAndDelete(req.params.id)

    // STEP 4: SEND RESPONSE
    res.json({
        status: 'success',
        message: 'Product deleted successfully'
    })
})

// get products by category

exports.getProductsByCategory = asyncHandler(async (req, res) => {
    // STEP 1: GET CATEGORY FROM URL
    const { category } = req.params
    // Example: /api/products/category/electronics → category = 'electronics'

    // STEP 2: VALIDATE CATEGORY
    const validCategories = ['electronics', 'clothing', 'books', 'food', 'other']
    if (!validCategories.includes(category)) {
        throw new AppError('Invalid category', 400)
    }

    // STEP 3: FIND PRODUCTS
    const products = await Product.find({
        category: category,           // Match category
        isPublished: true             // Sirf published products
    }).sort({ createdAt: -1 })       // Newest first

    // STEP 4: SEND RESPONSE
    res.json({
        status: 'success',
        count: products.length,
        data: products
    })
})
// get products stats
exports.getProductStats = asyncHandler(async (req, res) => {
    // MongoDB Aggregation Pipeline
    const stats = await Product.aggregate([
        // STEP 1: Group by Category
        {
            $group: {
                _id: '$category',                    // Group by category
                totalProducts: { $sum: 1 },          // Count products
                totalStock: { $sum: '$stock' },      // Sum of stock
                avgPrice: { $avg: '$price' },        // Average price
                minPrice: { $min: '$price' },        // Minimum price
                maxPrice: { $max: '$price' }         // Maximum price
            }
        },
        // STEP 2: Sort by total products (descending)
        {
            $sort: { totalProducts: -1 }
        }
    ])

    res.json({
        status: 'success',
        data: stats
    })
})
// bulk operations
exports.bulkCreateProducts = asyncHandler(async (req, res) => {
    // STEP 1: CHECK IF ARRAY
    const products = req.body.products
    if (!Array.isArray(products)) {
        throw new AppError('Products must be an array', 400)
    }

    // STEP 2: INSERT MANY
    const result = await Product.insertMany(products)
    // insertMany: Multiple documents ek query mein insert

    // STEP 3: SEND RESPONSE
    res.status(201).json({
        status: 'success',
        message: `${result.length} products created`,
        data: result
    })
})

exports.bulkDeleteProducts = asyncHandler(async (req, res) => {
    // STEP 1: GET IDs
    const { ids } = req.body
    if (!ids || !Array.isArray(ids)) {
        throw new AppError('Please provide array of IDs', 400)
    }

    // STEP 2: DELETE MANY
    const result = await Product.deleteMany({
        _id: { $in: ids }   // $in: In these IDs
    })
    // Example: ids = ['1','2','3'] → delete all 3

    // STEP 3: SEND RESPONSE
    res.json({
        status: 'success',
        message: `${result.deletedCount} products deleted`
    })
})