const mongoose = require("mongoose");
//Update the modle by using the refernces
const mySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const MyModel = mongoose.model("MyModel", mySchema);

module.exports = MyModel;
