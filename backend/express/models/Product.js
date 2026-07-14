const mongoose = require("mongoose")
const slugify = require("slugify")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        maxlength:[100, "Name cannot exceed 100 characters"]

    },
    slug:{
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxlength: [1000, "Description can not exceed 1000 characters"]
    },
    price:{
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price can not be negative"]
    },
    discountPrice:{
        type: Number,
        min:[0, "Discount price can not be negative"],
        validate: {
            validator: function(value){
                return !value || value <= this.price
            },
            message: "Discount price cannot be greater than regular price"
        }
    },
    category:{
        type:String,
        required: [true, "Category is required"],
        enum: ["electronics", "clothing", "books", "food", "other"]
    },
    brand:{
        type: String,
        trim: true
    },
    stock:{
        type: Number,
        required: [true, "Stock is required"],
        min: [0, "Stock cannot be negative"]
    },
    images:[
        {
            url: String,
            publicId: String,
            isMain:{
                type: Boolean,
                default: false
            }
        }
    ],
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    features: [
        {
            key: String,
            value: String
        }
    ],
    tags: [String],
    isPublished: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

// indexes
productSchema.index({name: 'text', description: 'text'})
productSchema.index({category: 1})
productSchema.index({price: 1})
productSchema.index({createdAt: -1})


// pre save 
productSchema.pre('save', function(next){
    if(this.isModified("name")){
        this.slug = slugify(this.name, {lower:true, strict:true})

    }
    next()
})

// virtual
productSchema.virtual("discountPercentage").get(function(){
    if(!this.discountPrice)return 0
    return Math.round(((this.price - this.discountPrice)/this.price) * 100)

})
// static methods
productSchema.statics.getCategories = async function(){
    return await this.distinct('category')
}


// query helpers
productSchema.query.inStock = function(){
    return this.where({stock: {$gt: 0}})

}
productSchema.query.priceRange = function(min, max){
    return this.where({price: {$gte: min, $lte:max}})
}

// Model
const Product = mongoose.model("Product", productSchema)

module.exports = Product
