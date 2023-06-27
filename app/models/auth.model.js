const Joi = require("joi");
const { mongo } = require("../../Configure/database.config");
const uniqueValidator = require("mongoose-unique-validator");

// Mongo DB schema for userDetails
const userDataSchema = new mongo.Schema({
  firstName: {
    type: String,
    min: [3, "Minimum 3 characters required"],
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    min: [3, "Minimum 3 characters required"],
    required: [true, "Last Name is required"],
  },
  role: {
    type: String,
    enum: {
      values: ["ADMIN", "USER", "DISTRIBUTOR"],
      message: "ADMIN, DISTRIBUTOR or USER are the only valid option",
    },
    default: "USER",
  },
  email: {
    type: String,
    unique: "Email ID must be unique",
    required: [true, "Email ID is required"],
  },
  loginId: {
    type: String,
    unique: "User ID already taken",
    required: [true, "Login ID is required"],
  },
  password: {
    type: String,
    min: [6, "Minimum 6 characters is required"],
    required: [true, "Password is required"],
  },
  gender: {
    type: String,
    enum: {
      values: ["MALE", "FEMALE"],
      message: "MALE or FEMALE are the only valid option",
    },
    required: [true, "gender is required"],
  },
  contactNumber: {
    type: Number,
    validate: {
      validator: function (v) {
        return /\d{9,10}/.test(v);
      },
      message: `Please enter a valid phone number!`,
    },
    required: [true, "Contact Number is required"],
  },
});

userDataSchema.plugin(uniqueValidator);

// Validation for user Data and Login
module.exports.validateSignup = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  loginId: Joi.string().required(),
  password: Joi.string().min(6).required().label("Password"),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({ "any.only": "{{#label}} does not match" }),
  gender: Joi.string().required(),
  contactNumber: Joi.number().required(),
});

module.exports.validateLogin = Joi.object()
  .keys({
    email: Joi.string().email(),
    loginId: Joi.string(),
    password: Joi.string().required(),
  })
  .or("email", "loginId");

module.exports.validateResetPassword = Joi.object({
  password: Joi.string().min(6).required().label("Password"),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

module.exports.userData = mongo.model("UserData", userDataSchema);
