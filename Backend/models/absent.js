const mongoose = require("mongoose");

const absentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
  time: { type: Number },
});

const Absent = mongoose.model("Absent", absentSchema);

exports.Absent = Absent;
