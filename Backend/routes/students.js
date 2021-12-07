const filesService = require("../services/fileService");
const profileServie = require("../services/profileService");
const avatarService = require("../services/avatarService");
const scanService = require("../services/scanService");
const { Student, validate } = require("../models/student");
const { User } = require("../models/user");
const { Absent } = require("../models/absent");
const auth = require("../middlewares/auth");
const formidable = require("formidable");
const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select({ _id: 1 });

  if (!user) return res.status(401).send("Not authorized");

  const students = await Student.find({ teacher: userId }).select("-descriptors");

  if (!students) return res.status(404).send("No students found");

  res.send(students);
});

router.get("/:id", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select({ _id: 1 });

  if (!user) return res.status(401).send("Not authorized");

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Not A Valid Student");

  const student = await Student.findById(req.params.id);

  if (!student || student.teacher.toString() !== userId)
    return res.status(404).send("No student found");

  res.send(student);
});

router.post("/", auth, async (req, res) => {
  const formOptions = {
    maxFileSize: 5 * 1024 * 1024,
    multiples: true,
  };

  const form = formidable(formOptions);

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).send(err.message);
    }

    const userId = req.user._id;
    const user = await User.findById(userId).select({ classrooms: 1, _id: -1 });

    req.body = fields;

    if (!user) return res.status(401).send("Not authorized");

    if (!files.avatar) return res.status(400).send("No file selected");

    const fileErrorMessage = avatarService.validateAvatar(files.avatar);
    if (fileErrorMessage) return res.status(400).send(fileErrorMessage);

    req.body.avatar = filesService.generateName(files.avatar);
    files.avatar.name = req.body.avatar;

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    req.body.cne = req.body.cne.toUpperCase();
    req.body.cin = req.body.cin.toUpperCase();
    req.body.teacher = userId;
    req.body.classrooms = _.uniq(req.body.classrooms);

    const validClassrooms = req.body.classrooms.filter((c) => mongoose.Types.ObjectId.isValid(c));

    if (validClassrooms.length != req.body.classrooms.length)
      return res.status(400).send("Classrooms invalid");

    const userClassrooms = user.classrooms.map((c) => c._id.toString());

    if (_.difference(req.body.classrooms, userClassrooms).length > 0)
      return res.status(400).send("Those Classrooms Are Not Availibale");

    const students = await Student.find()
      .or([{ cne: req.body.cne }, { cin: req.body.cin }])
      .and([{ teacher: userId }]);

    if (students.length > 0) return res.status(400).send("Student Already Exist");

    const student = new Student(
      _.pick(req.body, ["firstName", "lastName", "cin", "cne", "classrooms", "avatar", "teacher"])
    );

    await avatarService.saveAvatar(files.avatar);
    await student.save();

    res.send(student);
  });
});

router.put("/:id", auth, async (req, res) => {
  const formOptions = {
    maxFileSize: 5 * 1024 * 1024,
    multiples: true,
  };

  const form = formidable(formOptions);

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).send(err.message);
    }

    const userId = req.user._id;
    const user = await User.findById(userId).select({ classrooms: 1, _id: 1 });

    req.body = fields;

    if (!user) return res.status(401).send("Not authorized");

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("Not A Valid Student");

    let student = await Student.findById(req.params.id);

    if (!student || student.teacher.toString() !== userId)
      return res.status(400).send("No Student To Update");

    if (files.avatar) {
      const fileErrorMessage = avatarService.validateAvatar(files.avatar);
      if (fileErrorMessage) return res.status(400).send(fileErrorMessage);
      req.body.avatar = filesService.generateName(files.avatar);
      files.avatar.name = req.body.avatar;
    } else {
      req.body.avatar = student.avatar;
    }

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    req.body.cne = req.body.cne.toUpperCase();
    req.body.cin = req.body.cin.toUpperCase();
    req.body.teacher = userId;
    req.body.classrooms = _.uniq(req.body.classrooms);

    const validClassrooms = req.body.classrooms.filter((c) => mongoose.Types.ObjectId.isValid(c));

    if (validClassrooms.length != req.body.classrooms.length)
      return res.status(400).send("Classrooms invalid");

    const userClassrooms = user.classrooms.map((c) => c._id.toString());

    if (_.difference(req.body.classrooms, userClassrooms).length > 0)
      return res.status(400).send("Those Classrooms Are Not Availibale");

    const students = await Student.find()
      .or([{ cne: req.body.cne }, { cin: req.body.cin }])
      .and([{ teacher: userId }, { _id: { $ne: req.params.id } }]);

    if (students.length > 0) return res.status(400).send("Student Already Exist");

    if (files.avatar) await avatarService.saveAvatar(files.avatar);

    const result = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.send(result);
  });
});

router.delete("/:id", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select({ _id: 1 });

  if (!user) return res.status(401).send("Not authorized");

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Not A Valid Student");

  let student = await Student.findById(req.params.id).select({ teacher: 1 });

  if (!student || student.teacher.toString() !== userId)
    return res.status(400).send("No Student To Delete");

  student = await Student.findByIdAndDelete({
    _id: req.params.id,
  });

  if (!student) return res.status(404).send("No Student To Delete");

  await Absent.deleteMany({ user: userId, student: req.params.id });

  res.send(student);
});

router.get("/:id/classrooms", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select({ classrooms: 1, _id: 1 });

  if (!user) return res.status(401).send("Not authorized");

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Not A Valid Student");

  const student = await Student.findById(req.params.id).select({ classrooms: 1, teacher: 1 });

  if (!student || student.teacher.toString() !== userId)
    return res.status(404).send("No student found");

  const classrooms = student.classrooms.map((classroomId) => user.classrooms.id(classroomId));

  res.send(classrooms);
});

router.get("/:id/classrooms/:classroomId", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select({ classrooms: 1, _id: 1 });

  if (!user) return res.status(401).send("Not authorized");

  if (
    !mongoose.Types.ObjectId.isValid(req.params.id) ||
    !mongoose.Types.ObjectId.isValid(req.params.classroomId)
  )
    return res.status(400).send("Not A Valid Student Or Classroom");

  const student = await Student.findById(req.params.id).select({ classrooms: 1, teacher: 1 });

  if (!student || student.teacher.toString() !== userId)
    return res.status(404).send("No student found");

  let classroom = student.classrooms.find(
    (classroomId) => classroomId.toString() === req.params.classroomId
  );

  if (!classroom) return res.status(404).send("No Classroom found");

  classroom = user.classrooms.id(req.params.classroomId);

  res.send(classroom);
});

router.get("/:id/avatar", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select({ _id: 1 });

  if (!user) return res.status(401).send("Not authorized");

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Not A Valid Student");

  const student = await Student.findById(req.params.id).select({ avatar: 1, teacher: 1 });

  if (!student || student.teacher.toString() !== userId)
    return res.status(404).send("No student found");

  const data = await avatarService.readAvatar(student.avatar);

  res.set("Content-Type", "image/jpeg");
  res.set("Content-Disposition", "inline");

  res.send(data);
});

router.get("/:id/profiles/:fileName", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select({ _id: 1 });

  if (!user) return res.status(401).send("Not authorized");

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Not A Valid Student");

  const student = await Student.findById(req.params.id).select({ profiles: 1, teacher: 1 });

  if (!student || student.teacher.toString() !== userId)
    return res.status(404).send("No student found");

  const studentProfile = student.profiles.find((profile) => profile === req.params.fileName);

  if (!studentProfile) return res.status(404).send("No image To Display");

  const data = await profileServie.readProfile(studentProfile);

  res.set("Content-Type", "image/jpeg");
  res.set("Content-Disposition", "inline");

  res.send(data);
});

router.post("/:id/profiles", auth, async (req, res) => {
  const formOptions = {
    maxFileSize: 5 * 1024 * 1024,
    multiples: true,
  };

  const form = formidable(formOptions);

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).send(err.message);
    }

    const userId = req.user._id;
    const user = await User.findById(userId).select({ classrooms: 1, _id: -1 });
    if (!user) return res.status(401).send("Not authorized");

    req.body = fields;

    if (!files.profiles) return res.status(400).send("No files selected");

    for (const profileFile of files.profiles) {
      const fileErrorMessage = profileServie.validateProfile(profileFile);
      if (fileErrorMessage) return res.status(400).send(fileErrorMessage);
      profileFile.name = filesService.generateName(profileFile);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("Not A Valid Student");

    let student = await Student.findById(req.params.id).select({
      profiles: 1,
      descriptors: 1,
      teacher: 1,
    });

    if (!student || student.teacher.toString() !== userId)
      return res.status(400).send("No Student To Update");

    for (const profileFile of files.profiles) {
      await profileServie.saveProfile(profileFile);
      student.profiles.push(profileFile.name);
    }

    for (const profileFile of files.profiles) {
      const face = await scanService.getFaceFromImage(profileServie.getFilePath(profileFile.name));
      if (face) {
        const descriptor = await scanService.getDescriptorFromFace(face);
        student.descriptors.push(JSON.stringify(descriptor));
      }
    }

    await student.save();

    res.send(student.profiles);
  });
});

module.exports = router;
