const { User } = require("../models/user");
const { Student } = require("../models/student");
const { Absent } = require("../models/absent");
const { validate: validateClassroom } = require("../models/classroom");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select({ classrooms: 1, _id: -1 });

  if (!user) return res.status(401).send("Not authorized user");

  res.send(user.classrooms);
});

router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select({ classrooms: 1, _id: -1 });

  if (!user) return res.status(401).send("Not authorized user");

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Not A Valid Classroom");

  const classroom = user.classrooms.id(req.params.id);

  if (!classroom) return res.status(404).send("No classroom found");

  res.send(classroom);
});

router.post("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select({ classrooms: 1, _id: -1 });

  if (!user) return res.status(401).send("Not authorized user");

  const { error } = validateClassroom(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.name = req.body.name.toLowerCase();

  let classroom = user.classrooms.find((c) => c.name === req.body.name);
  if (classroom) return res.status(400).send("Classroom Already Exist");

  user.classrooms.push(req.body);

  classroom = user.classrooms.find((c) => c.name === req.body.name);

  await user.save();

  res.send(classroom);
});

router.put("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select({ classrooms: 1, _id: -1 });

  if (!user) return res.status(401).send("Not authorized");

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Not A Valid Classroom");

  const { error } = validateClassroom(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  req.body.name = req.body.name.toLowerCase();

  let classroom = user.classrooms.id(req.params.id);
  if (!classroom) return res.status(400).send("No Classroom To Edit");

  classroom = user.classrooms.find((c) => c.name === req.body.name);
  if (classroom) return res.status(400).send("This Name Already Exist");

  classroom = user.classrooms.id(req.params.id);
  classroom.name = req.body.name;

  await user.save();

  res.send(classroom);
});

router.delete("/:id", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select({ classrooms: 1, _id: -1 });

  if (!user) return user.status(401).send("Not authorized");

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Not A Valid Classroom");

  const classroom = user.classrooms.id(req.params.id);

  if (!classroom) return res.status(404).send("No Classroom To Delete");

  user.classrooms.id(req.params.id).remove();

  await user.save();

  const students = await Student.find({ teacher: userId }).select({ classrooms: 1 });

  for (const student of students) {
    student.classrooms = student.classrooms.filter(
      (classroomId) => classroomId.toString() !== req.params.id
    );

    student.save();
  }

  await Absent.deleteMany({ user: userId, classroom: req.params.id });

  res.send(classroom);
});

module.exports = router;
