import Joi from "joi";
import BaseDto from "../../../common/DTO/base.dto.js"

class RegisterDTO extends BaseDto {
    static schema = Joi.object({
        name: Joi.string().trim().min(2).max(60).required(),
        email: Joi.string().trim().required().email(),
        password: Joi.string().trim().message('Password must contain 6 character').min(6).required(),
        role: Joi.string().valid("customer", "seller").default("customer"),
    })
}

export default RegisterDTO

