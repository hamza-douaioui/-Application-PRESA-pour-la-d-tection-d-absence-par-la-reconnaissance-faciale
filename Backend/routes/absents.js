const { User } = require("../models/user");
const { Student } = require("../models/student");
const { Absent } = require("../models/absent");
const auth = require("../middlewares/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select({ classrooms: 1, _id: 1 });

  if (!user) return res.status(401).send("Not authorized user");

  const absents = await Absent.find({ user: userId });

  const absentsList = [];

  for (const absent of absents) {
    const student = await Student.findById(absent.student);
    const classroom = user.classrooms.id(absent.classroom);

    absentsList.push({
      _id: absent._id,
      student: _.pick(student, ["_id", "firstName", "lastName", "cin", "cne"]),
      classroom: classroom,
      time: absent.time,
    });
  }

  res.send(absentsList);
});

module.exports = router;
