const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
  cin: {
    type: String,
    minlength: 5,
    maxlength: 255,
    trim: true,
    required: true,
    uppercase: true,
    unique: true,
  },
  cne: {
    type: String,
    minlength: 5,
    maxlength: 1025,
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
  },
  avatar: { type: String, required: true },
  profiles: { type: [String] },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  classrooms: { type: [mongoose.Schema.Types.ObjectId], ref: "Classroom" },
  descriptors: { type: [String] },
});

const Student = mongoose.model("Student", studentSchema);

function validateStudent(student) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(1).max(255).required(),
    lastName: Joi.string().trim().min(1).max(255).required(),
    cin: Joi.string().trim().min(5).max(255).required(),
    cne: Joi.string().trim().min(5).max(255).required(),
    avatar: Joi.string()
      .regex(/.(jpg|jpeg|png|PNG|JPG|JPEG)$/)
      .message("invalid image")
      .required()
      .trim(),
    classrooms: Joi.array().label("Classrooms").required(),
  });

  return schema.validate(student);
}

exports.Student = Student;
exports.validate = validateStudent;
