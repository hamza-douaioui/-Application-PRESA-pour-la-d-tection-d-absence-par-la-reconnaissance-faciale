const filesService = require("../services/fileService");
const avatarService = require("../services/avatarService");
const formidable = require("formidable");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) return res.status(404).send("User Not Found");

  return res.send(user);
});

router.get("/me/avatar", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select({ avatar: 1, _id: -1 });

  if (!user) return res.status(401).send("Not authorized");

  const data = await avatarService.readAvatar(user.avatar);

  res.set("Content-Type", "image/jpeg");
  res.set("Content-Disposition", "inline");

  return res.send(data);
});

router.post("/", async (req, res) => {
  const formOptions = {
    maxFileSize: 5 * 1024 * 1024,
    maxFields: 6,
  };

  const form = formidable(formOptions);

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).send(err.message);
    }

    req.body = fields;

    if (req.body.password != req.body.passwordConfirmation)
      return res.status(400).send("Invalid password confirmation");

    if (!files.avatar) return res.status(400).send("Please set an Image");

    const fileErrorMessage = avatarService.validateAvatar(files.avatar);
    if (fileErrorMessage) return res.status(400).send(fileErrorMessage);

    req.body.avatar = filesService.generateName(files.avatar);
    delete req.body.passwordConfirmation;

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email }).select({ email: 1 });
    if (user) return res.status(400).send("User Already Registred");

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    files.avatar.name = req.body.avatar;
    await avatarService.saveAvatar(files.avatar);
    user = new User(_.pick(req.body, ["firstName", "lastName", "email", "password", "avatar"]));
    await user.save();

    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token)
      .json(_.pick(user, ["firstName", "lastName", "email", "avatar", "classrooms"]));
  });
});

module.exports = router;
