const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path")
const multer = require("multer");
require("dotenv").config({ path: "./config.env" });

const con = require("./db/connections.js");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const csvRoutes = require("./routes/route")
// app.use("/api/upload" , csvRoutes)
app.use(require("./routes/route.js"));
app.use("/public", express.static(path.join(__dirname , "public")));

con
  .then((db) => {
    if (!db) {
      return process.exit(1);
    }
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });

    app.on("error", (err) => console.log(`Failed to connect ${err}`));
  })
  .catch((error) => {
    console.log(error);
  });
