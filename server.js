const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", require("./routes/userRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  require("./database/db");
});
