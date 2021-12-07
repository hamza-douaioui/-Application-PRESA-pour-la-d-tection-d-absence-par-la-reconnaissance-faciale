const classrooms = require("../routes/classrooms");
const users = require("../routes/users");
const login = require("../routes/auth");
const students = require("../routes/students");
const scans = require("../routes/scans");
const absents = require("../routes/absents");
const error = require("../middlewares/error");

module.exports = function (app) {
  app.use("/login", login);
  app.use("/classrooms", classrooms);
  app.use("/users", users);
  app.use("/students", students);
  app.use("/scans", scans);
  app.use("/absents", absents);
  app.use(error);
};
