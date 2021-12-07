const { User } = require("../models/user");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("invalid email or password");

  const isValidAccount = await bcrypt.compare(req.body.password, user.password);
  if (!isValidAccount) return res.status(400).send("invalid email or password");

  const token = await user.generateAuthToken();
  return res.status(200).send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(req);
}

module.exports = router;
