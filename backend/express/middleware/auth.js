const jwt = require("jsonwebtoken")
const User = require("../models/User")
const AppError = require("../utils/AppError")
const asyncHandler = require("../utils/asyncHandler")


// 1. PROTECT ROUTES (Authentication)

exports.protect = asyncHandler(async(req, res,next)=>{
    let token ;
    
    // token check karo header se
    if(req.headers.authorization && req.headers.authorization.startsWith(`Bearer`)){
        token = req.headers.authorization.split(" ")[1]
    }
    // // cookie se bhi check kar sakte ha 
    // if(req.cookies.token){
    //     token = req.cookies.token
    // }
    if(!token){
        return next(new AppError("You are not logged in. Please login first", 401))
    }
    try{
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // check if user still exists
        const user = await User.findById(decored.userId).select("-password")
        if(!user){
            return next(new AppError("The user belonging to this token no longer exists.", 401))
        }
        // check if user is active
        if(!user.active){
            return next(new AppError("This account has been deactivated", 401))
        }
        // check if password changed after token issued
        // implement password changedAt logic if needed
        // attach user to request
        req.user = user
        next();
    }catch(err){
        if(err.name === "JsonWebTokenError"){
            return next(new AppError("Invalid token. Please login again", 401));
        }
        if(err.name === "TokenExpiredError"){
            return next(new AppError("Your token has expired. Please login again.", 401))
        }
        return next(new AppError("Authentication Failed.", 401))
    }
})
// 2. RESTRICT ROLES (Authorization)
exports.restrictTo = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError("You do not have permission to perform this action", 403))
        }
        next()
    }
}
// 3. REFRESH TOKEN
exports.refreshToken = asyncHandler(async(req, res)=>{
    const {refreshToken} = req.body;

    if(!refreshToken){
        throw new AppError("Refresh token required", 400)
    }
    try{
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId)

        if(!user){
            throw new AppError("User not found", 401)
        }
        const accessToken = user.generateAccessToken()
        res.json({accessToken})
    }catch(err){
        throw new AppError("Invalid refresh token", 401)
    }

})