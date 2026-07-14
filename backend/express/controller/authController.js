const User = require("../models/User")
const AppError = require("../utils/AppError")
const asyncHandler = require("../utils/asyncHandler")
const { userValidation } = require("../utils/validators")


// register
exports.register = asyncHandler(async (req, res) => {
    // STEP 1: VALIDATION
    // Kya: User ne sahi data bheja?
    const { error } = userValidation.register.validate(req.body)
    if (error) {
        throw new AppError(error.details[0].message, 400)
    }
    // Example: agar email nahi bheja → "Email is required"

    // STEP 2: EXTRACT DATA
    const { name, email, password } = req.body
    // Destructuring: req.body se name, email, password nikaal lo

    // STEP 3: CHECK EXISTING USER
    // Kya: Yeh email pehle se register hai?
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new AppError('User already exists with this email', 400)
    }
    // Example: john@test.com already exists → error

    // STEP 4: CREATE USER
    // Database mein user create karo
    const user = await User.create({
        name,
        email,
        password  // Mongoose pre-save hook automatically hash karega
    })
    // Database: { _id: "123...", name: "John", email: "john@test.com", password: "hashed..." }

    // STEP 5: GENERATE TOKENS
    // User login rakhne ke liye tokens chahiye
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    // accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    // refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

    // STEP 6: SAVE REFRESH TOKEN
    // Database mein refresh token save karo
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    // validateBeforeSave: false → validation mat karo (already validated)

    // STEP 7: REMOVE PASSWORD
    // Password response mein mat bhejo (security reason)
    user.password = undefined
    // Ab user object mein password nahi hai

    // STEP 8: SEND RESPONSE
    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
            user,  // { _id, name, email, createdAt, ... }
            accessToken,
            refreshToken
        }
    })
})
// ----LOGIN -----
exports.login = asyncHandler(async (req, res) => {
    // STEP 1: VALIDATE
    const { error } = userValidation.login.validate(req.body)
    if (error) {
        throw new AppError(error.details[0].message, 400)
    }

    // STEP 2: EXTRACT
    const { email, password } = req.body

    // STEP 3: FIND USER WITH PASSWORD
    // .select('+password') → password field bhi laao (by default hidden hai)
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        throw new AppError('Invalid email or password', 401)
    }
    // Agar user nahi mila → "Invalid email or password" (generic message for security)

    // STEP 4: CHECK ACCOUNT STATUS
    if (!user.active) {
        throw new AppError('Account is deactivated. Contact support.', 403)
    }
    // Admin ne account disable kiya ho toh login na karne dein

    // STEP 5: VERIFY PASSWORD
    // user.comparePassword() → bcrypt compare karega
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        throw new AppError('Invalid email or password', 401)
    }

    // STEP 6: UPDATE LAST LOGIN
    user.lastLogin = new Date()  // Current time
    await user.save({ validateBeforeSave: false })
    // Tracking ke liye: user ne kab last login kiya

    // STEP 7: GENERATE TOKENS
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    // STEP 8: SAVE NEW REFRESH TOKEN
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    // STEP 9: REMOVE PASSWORD
    user.password = undefined

    // STEP 10: SEND RESPONSE
    res.json({
        status: 'success',
        message: 'Login successful',
        data: {
            user,
            accessToken,
            refreshToken
        }
    })
})
// logout
exports.logout = asyncHandler(async (req, res) => {
    // STEP 1: GET USER (from middleware)
    // Authentication middleware ne user set kiya: req.user
    const user = await User.findById(req.user._id)

    // STEP 2: REMOVE REFRESH TOKEN
    user.refreshToken = null  // Database se token hatao
    await user.save({ validateBeforeSave: false })

    // STEP 3: SEND RESPONSE
    res.json({
        status: 'success',
        message: 'Logged out successfully'
    })
})
exports.forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    // STEP 1: FIND USER
    const user = await User.findOne({ email })
    if (!user) {
        // Security: Generic message (hacker ko nahi batana ke email exists nahi karta)
        throw new AppError('User not found with this email', 404)
    }

    // STEP 2: GENERATE RESET TOKEN
    // generateResetToken() method User model mein define hai
    const resetToken = user.generateResetToken()
    // resetToken: "a1b2c3d4e5f6..." (random string)

    // STEP 3: SAVE TOKEN IN DATABASE
    await user.save({ validateBeforeSave: false })

    // STEP 4: SEND EMAIL (commented in code)
    // const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    // await sendResetEmail(user.email, resetUrl)

    // STEP 5: SEND RESPONSE
    res.json({
        status: 'success',
        message: 'Password reset token sent to email'
    })
})
exports.resetPassword = asyncHandler(async (req, res) => {
    // STEP 1: GET TOKEN FROM URL
    const { token } = req.params  // /reset-password/a1b2c3d4e5f6
    const { password } = req.body

    // STEP 2: HASH THE TOKEN
    // User ne jo token bheja, same process se hash karo
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
    // "a1b2c3d4" → "9f86d081884c..."

    // STEP 3: FIND USER WITH VALID TOKEN
    const user = await User.findOne({
        resetPasswordToken: hashedToken,  // Database mein hashed token match karo
        resetPasswordExpire: { $gt: Date.now() }  // Token expire nahi hua
    })

    if (!user) {
        throw new AppError('Invalid or expired token', 400)
    }
    // Token invalid ya expire ho gaya

    // STEP 4: UPDATE PASSWORD
    user.password = password  // Mongoose pre-save hook hash karega
    user.resetPasswordToken = undefined  // Token hatao (use ho gaya)
    user.resetPasswordExpire = undefined  // Expiry hatao
    await user.save()  // validateBeforeSave: true (by default)

    // STEP 5: SEND RESPONSE
    res.json({
        status: 'success',
        message: 'Password reset successful'
    })
})
// change password
exports.changePassword = asyncHandler(async (req, res) => {
    // STEP 1: GET DATA
    const { currentPassword, newPassword } = req.body

    // STEP 2: FIND USER WITH PASSWORD FIELD
    const user = await User.findById(req.user._id).select('+password')
    // req.user authentication middleware se aaya hai

    // STEP 3: VERIFY CURRENT PASSWORD
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
        throw new AppError('Current password is incorrect', 401)
    }
    // Security: Current password verify karna zaroori hai

    // STEP 4: UPDATE PASSWORD
    user.password = newPassword  // Mongoose pre-save hook hash karega
    await user.save()
    // refreshToken? Change nahi karna (user wahi hai)

    // STEP 5: SEND RESPONSE
    res.json({
        status: 'success',
        message: 'Password changed successfully'
    })
})