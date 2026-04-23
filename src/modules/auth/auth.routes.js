import { Router } from "express";
import controller from "./auth.controller.js" // here ai made the chages
import validate from "../../common/middleware/validate.middleware.js"
import RegisterDTO from "./dto/register.dto.js";
import {authenticate} from './auth.middleware.js'
import LoginDTO from "./dto/login.dto.js";

const router = Router()

router.post("/register", validate(RegisterDTO), controller.register )
router.post('/login', validate(LoginDTO), controller.login)
router.post('/logout', authenticate, controller.logout)
router.get('/me', authenticate, controller.getme)

export default router