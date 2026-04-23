import jwt from 'jsonwebtoken';
import User from './auth.model.js';
import ApiError from '../../common/utils/api-error.js';
import { verifyAccessToken } from '../../common/utils/jwt.util.js';

const authenticate = async (req, res, next) => {
    let token;
    if(req.headers.authenticate?.startsWith('Bearer')){
        token = req.headers.authenticate.split(" ")[1]
    }

    if (!token) {
        throw ApiError.unAuthorized('Not Authenticated')
    }

    const decoded = verifyAccessToken(token)
    
    const user = await User.findByID(decoded.id)
    if (!user) {
        throw ApiError.unAuthorized('User not exist in DB')
    }

    req.user = {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email
    }
    next()
}

const authorize = async(...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw ApiError.unAuthorized('Your are not permit to access')
        }
        next();
    }
}

export {
    authenticate,
    authorize
}