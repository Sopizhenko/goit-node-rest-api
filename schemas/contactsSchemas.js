import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone cannot be empty",
    "any.required": "Phone is required",
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email address",
  }),
  phone: Joi.string().optional(),
})
  .min(1)
  .messages({
    "object.min": "Body must have at least one field",
  });
