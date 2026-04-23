import crypto from 'crypto'
import { realpathSync } from 'fs'
import jwt from 'jsonwebtoken'


const genrateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET),
    {expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME || '15m' }
}

const verifyAccessToken = (token) => {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET)
}
const genrateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET),
    {expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME || '7d' }
}

const verifyRefreshToken = (token) => {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}

const generateResetToken= () => {
    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashToken = crypto.createHash("sha256").update(rawToken).digest('hex')

    return { rawToken, hashToken}
}


export const generateIdToken = (user, clientId) => {
    const payload = {
        iss: "http://localhost:3000",        // Your server URL
        sub: user._id.toString(),            // The User's ID
        aud: clientId || "default_client",   // The Application receiving it
        email: user.email,
        name: user.name
    };
    
    // ID Tokens usually expire quickly, 15m is standard
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
}


export{
    generateResetToken,
    genrateAccessToken,
    verifyAccessToken,
    genrateRefreshToken,
    verifyRefreshToken,
    generateIdToken
}
