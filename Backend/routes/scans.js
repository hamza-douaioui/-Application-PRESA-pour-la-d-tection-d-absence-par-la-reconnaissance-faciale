const fileService = require("../services/fileService");
const scanService = require("../services/scanService");
const classroomImageService = require("../services/classroomImageService");
const { User } = require("../models/user");
const { Student } = require("../models/student");
const { Absent } = require("../models/absent");
const auth = require("../middlewares/auth");
const formidable = require("formidable");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res, next) => {
  const formOptions = {
    maxFields: 2,
  };

  const form = formidable(formOptions);

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(401).send("Not a valid image");
    }

    const userId = req.user._id;
    const user = await User.findById(userId).select({ classrooms: 1, _id: -1 });

    if (!user) return res.status(401).send("Not authorized");

    if (!files.classroomImage) return res.status(400).send("No Image Selected");

    req.body = fields;

    const fileErrorMessage = classroomImageService.validateClassroomImage(files.classroomImage);

    if (fileErrorMessage) return res.status(400).send(fileErrorMessage);

    files.classroomImage.name = fileService.generateName(files.classroomImage);

    const classroom = user.classrooms.id(req.body.classroom);

    if (!classroom) return res.status(400).send("No Classroom Selected");

    const students = await Student.find({ teacher: userId, classrooms: req.body.classroom });

    if (students.length === 0) return res.status(404).send("No Students In The Classroom");

    await classroomImageService.saveClassroomImage(files.classroomImage);
    const classroomImagePath = classroomImageService.getFilePath(files.classroomImage.name);
    const facesInClassroom = await scanService.getAllFacesFromImage(classroomImagePath);

    if (!facesInClassroom.length) return res.status(400).send("No Faces Detected");

    const classroomCanvas = await scanService.fileToCanvas(classroomImagePath);

    const knownFacesBoxes = [];
    const unknownFacesBoxes = [];
    const availableStudents = [];

    //START

    for (const face of facesInClassroom) {
      let i = 0;
      for (; i < students.length; i++) {
        const student = students[i];

        const labeledDescriptors = scanService.getLabeledDescriptors(
          student._id.toString(),
          student.descriptors
        );

        const bestMatch = await scanService.compareTwoDescriptors(
          labeledDescriptors,
          face.descriptor
        );

        if (bestMatch.label === student._id.toString()) {
          availableStudents.push(student._id.toString());
          const fullName = student.firstName + " " + student.lastName;
          knownFacesBoxes.push(scanService.drawLabeledBoxOnFace(face, fullName));
          break;
        }
      }

      if (i === students.length)
        unknownFacesBoxes.push(
          scanService.drawLabeledBoxOnFace(face, "Unknown", "rgba(255,0,0,1)")
        );
    }
    //END

    let absStudents = students.filter(
      (student) => !availableStudents.includes(student._id.toString())
    );

    absStudents = absStudents.map((student) => {
      return _.pick(student, ["_id", "cin", "cne", "firstName", "lastName", "avatar"]);
    });

    //----------------------------------------------------------------------
    knownFacesBoxes.forEach((box) => box.draw(classroomCanvas));
    unknownFacesBoxes.forEach((box) => box.draw(classroomCanvas));

    //----------------------------------------------------------------------
    const imageBuffer = classroomCanvas.toBuffer("image/jpeg");
    const fileDirectory = classroomImageService.getBaseUrl();
    const fileName = user._id + "_" + files.classroomImage.name;

    fileService.saveBufferAsFile(fileDirectory, fileName, imageBuffer);

    const base64str = Buffer.from(imageBuffer).toString("base64");

    for (const student of absStudents) {
      const absent = new Absent({
        user: userId,
        student: student._id,
        classroom: req.body.classroom,
        time: Date.now(),
      });

      await absent.save();
    }

    res.send({ students: absStudents, resultImage: base64str });
  });
});

module.exports = router;
