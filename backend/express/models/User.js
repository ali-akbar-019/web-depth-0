const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be atleast 2 characters"],
        maxlength: [50, "Name can not exceed 50 characters"]
    },
    email:{
        type:String, 
        requried: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be atleast 6 characters"],
        select: false //password default mein select nahi huwa
    },
    role: {
        type: String, 
        enum: ["user", "admin", "superadmin"],
        default: "user"
    },
    avatar: {
        type: String,
        default: 'default-avatar.jpg'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: String,
    lastLogin: Date,
    active:{
        type: Boolean,
        default: true
    }
},{
    timestamps: true //created at, updated at , auto add honge
})
// indexes (performance)
userSchema.index({email: 1}) //email pe index laga do
userSchema.index({role: 1})
userSchema.index({createdAt: -1})

// --------pre save middle ware
userSchema.pre("save", async function(next){
    // sirf password chane ho to hash karo
    if(!this.isModified("password")) return next()
    const salt = await bcrypt.genSalt(12) //higher salt rounds = more secure
// password ko hash kar k store kar lo
    this.password = await bcrypt.hash(this.password, salt)
    next()
} )

// instance methods
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}

// generate JWT
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({userId: this._id, role: this.role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE || "1d"})

}

// generate refresh token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({userId: this._id}, process.env.JWT_SECRET, {expiresIn: "30d"})

}

// generate password reset token
userSchema.methods.generateResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex")

    this.resetPasswordToken = crypto.createHash('sha256')
    .update(resetToken)
    .digest('hex')

    this.resetPasswordExpire = Date.now() * 10 * 60 * 1000 //10 mins
    return resetToken
}
// query helper
userSchema.query.onlyActive = function(){
    return this.where({active: true})


}
userSchema.query.byRole = function(role){
    return this.where({role})
}

// virtual properties
userSchema.virtual('fullName').get(function(){return this.name})


// model
const User = mongoose.model('User', userSchema)
module.exports = User