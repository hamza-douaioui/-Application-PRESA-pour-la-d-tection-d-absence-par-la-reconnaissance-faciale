const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
    trim: true,
    lowercase: true
  }
});

const Classroom = mongoose.model("Classroom", classroomSchema);

function validateClassroom(classroom) {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required()
  });

  return schema.validate(classroom);
}

module.exports.classroomSchema = classroomSchema;
module.exports.Classroom = Classroom;
module.exports.validate = validateClassroom;
