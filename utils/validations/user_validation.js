import Joi from "joi";

export const regiterValidationSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role:Joi.string()
  // phoneNumber: Joi.string().min(11).max(11).required(),
  // postCode: Joi.string().min(2).max(10).required(),
  // address: Joi.string().min(5).max(255).required(),
});

export const logInValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role:joi.string()
});
