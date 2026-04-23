import Joi from "joi";
import BaseDto from "../../../common/DTO/base.dto.js"

class LoginDTO extends BaseDto{
    static schema = Joi.object({
        email: Joi.string().lowercase().trim().email().required(),
        password: Joi.string().required()
    })
}

export default LoginDTO