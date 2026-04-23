import * as authService from './auth.service.js'
import ApiResponse from '../../common/utils/api-response.js'

const register = async(req, res) => {
    const user = await authService.register(req.body)
    ApiResponse.created(res, 'User created Successfully', user)
}

const login = async(req, res) => {
    // 🔴 ADDED "await" HERE
    const {user, accessToken, refreshToken, id_token} = await authService.login(req.body)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
    })

    ApiResponse.ok(res, "Login Successfully", {user, accessToken, id_token})
    
}

const logout = async(req, res) => {
    await authService.logout(req.user.id)
    res.clearCookie('refreshToken')
    ApiResponse.ok(res, 'Logout successfully');
}

const getme = async(req, res) => {
    const user = await authService.getMe(req.user.id)
    ApiResponse.ok(res, 'User Profile is here', user)
}

export default { register, login, logout, getme }
