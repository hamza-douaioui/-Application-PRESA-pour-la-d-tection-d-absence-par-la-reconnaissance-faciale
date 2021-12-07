module.exports = function (err, req, res, next) {
  console.log("LOG ERROR HERE ", err);
  return res.status(500).send("Something faild");
};
