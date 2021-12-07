const { classroomSchema } = require("./classroom");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    minlength: 1,
    maxlength: 255,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  avatar: { type: String, required: true },
  classrooms: { type: [classroomSchema] },
});

userSchema.methods.generateAuthToken = function () {
  const keyToken = config.get("JWT_PRIVATE_KEY");
  const token = jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      avatar: this.avatar,
      classrooms: this.classrooms,
    },
    keyToken
  );

  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(1).max(255).required(),
    lastName: Joi.string().trim().min(1).max(255).required(),
    email: Joi.string().trim().min(1).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
    avatar: Joi.string()
      .trim()
      .regex(/.(jpg|jpeg|png|PNG|JPG|JPEG)$/)
      .message("invalid image")
      .required(),
  });

  return schema.validate(user);
}

module.exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
