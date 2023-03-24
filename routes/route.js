const express = require("express");
const multer = require("multer");

const fs = require("fs");
const routes = express.Router();
const controller = require("../controller/controller");
routes
  .route("/api/categories")
  .post(controller.create_categories)
  .get(controller.get_categories);

routes
  .route("/api/transaction")
  .post(controller.create_transaction)
  .get(controller.get_transaction)
  .delete(controller.delete_transaction);

routes.route("/api/labels").get(controller.get_labels);

// const fs = require("fs");
const path = require("path")
const csv = require("fast-csv")
// const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    if (!fs.existsSync("public/csv")) {
      fs.mkdirSync("public/csv");
    }
    cb(null, "public/csv");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== ".csv") {
      return cb(new Error("Only csv files are valid"));
    }
    cb(null, true);
  },
});
routes.route("/api/upload").post(upload.single("csvFile"), controller.create);
// routes.route('/api/uploads').post((req , res) => {

// })
module.exports = routes;
