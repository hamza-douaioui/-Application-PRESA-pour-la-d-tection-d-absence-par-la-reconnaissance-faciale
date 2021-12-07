require("express-async-errors");

module.exports = function () {
  process.on("uncaughtException", (error) => {
    console.log("WE GOT AN EXCEPTION OUTSIDE THE EXPRESS PROCESS ", error);
    process.exit(1);
  });

  process.on("unhandledRejection", (error) => {
    console.log("WE HAVE AN UNHANDLED REJECTION ", error);
    process.exit(2);
  });
};
