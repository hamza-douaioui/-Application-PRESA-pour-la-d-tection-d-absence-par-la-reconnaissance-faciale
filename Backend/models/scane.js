const { classroomSchema } = require("./classroom");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

//schema
const scannSchema = new mongoose.Schema({

    avatar: { type: String },
    classroom: { type: [classroomSchema] }
});

const Pscan = mongoose.model("Pscan", scannSchema);

function validateScann(Pscan) {
    const schema = Joi.object({
        avatar: Joi.string(),
        classroom: Joi.array().label("Classrooms")
    });

    return schema.validate(Pscan);
}

exports.Pscan = Pscan;
exports.validate = validateScann;
