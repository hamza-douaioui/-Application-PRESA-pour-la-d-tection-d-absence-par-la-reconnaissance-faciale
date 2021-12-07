const express = require("express");
const app = express();
app.use(express.json());
require("./init/logging")();
require("./init/config")();
require("./init/database")();
require("./init/routes")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("App Running on port ", port);
});
