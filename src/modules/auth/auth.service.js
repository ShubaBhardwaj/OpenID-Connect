import User from './auth.model.js'
import ApiError from '../../common/utils/api-error.js'
import {generateResetToken, verifyRefreshToken, genrateAccessToken, generateIdToken }   from '../../common/utils/jwt.util.js'

const hashToken = (rawToken) => crypto.createHash("sha256").update(rawToken).digest('hex')


const register = async({name, email, password, role}) => {
    const isExist = await User.findOne({email})
    if (isExist) {
        throw ApiError.conflict('Email already exist')
    }

    const {rawToken, hashToken} = generateResetToken()

    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashToken
    })

    const userObject = user.toObject()
    delete userObject.password
    delete userObject.verificationToken

    return userObject
    // send email to user rawToken
}

const login = async({email, password}) => {
    const user = await User.findOne({email}).select('+password')
    if(!user) throw ApiError.unAuthorized('user not found')
    
    if(!user.isVerifiyed) throw ApiError.forbidden('user not verifiyed')

    // check the password
    const isMatch = await user.comparePassword(password)
    if(!isMatch) throw ApiError.unAuthorized('Invalid email or password')
    
    const accessToken = genrateAccessToken({id: user._id, role: user.role})
    const refreshToken = genrateRefreshToken({id: user._id})

    const idToken = generateIdToken(user, process.env.FRONTEND_CLIENT_ID) 

    const hashrefreshToken = hashToken(refreshToken)

    user.refreshToken = hashrefreshToken
    await user.save({validateBeforeSave: false})

    userObject = user.toObject()
    delete userObject.password
    delete userObject.refreshToken

    return { user: userObject, accessToken, refreshToken, id_token: idToken}

}

const refresh = async(token) => {
    const decoded = verifyRefreshToken(token)

    const user = await User.findById(decoded._id).select('+refreshToken')
    if(!user) throw ApiError.unAuthorized('user not found')
    
    if (user.refershToken !== hashToken(token)) throw ApiError.unAuthorized('Invalid refersh token')
    
    const accessToken = genrateAccessToken({id: user._id, role: user.role})
    const refershToken = genrateRefreshToken({id: user._id})

    user.refershToken = refershToken
    await user.save({validateBeforeSave: false})

    return{
        accessToken,
        refershToken
    }
}

const logout = async(userID) =>{
    // const user = user.findById(userID).select('+refreshToken')
    // if(!user) throw ApiError.unAuthorized('user not found')

    // user.refershToken = undefined
    // user.save({validateBeforeSave: false})

    User.findByIdAndUpdate(userID, {refershToken: undefined})
}

const forgotPassword = async(email) => {
    const user = await User.findOne({email}).select("resetPasswordToken")
    if(!user) throw ApiError.notfound("user not found")

    const { rawToken, hashToken} = generateResetToken()

    user.resetPasswordToken = hashToken
    user.resetPasswordTokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save()

    // rawToken ko mail pr send kro 
}

const getMe = async(userID) => {
    const user = await User.findById(userID)
    if (!user) {
        throw ApiError.notfound('user Not found')
    }
    return user;
}

export default {
    register,
    login,
    forgotPassword,
    refresh,
    logout,
}