const model = require("../models/model.js");

// posting categories
// post
async function create_categories(req, res) {
  const Create = new model.Categories({
    type: "Investment",
    color: "#8F00FF",
  });
  await Create.save();
  res.json(Create);
  // console.log(Create);
}

// get
async function get_categories(req, res) {
  let data = await model.Categories.find({});

  let filter = data.map((value) =>
    Object.assign({}, { type: value.type, color: value.color })
  );
  res.send(filter);
}
// post transaction
async function create_transaction(req, res) {
  if (!req.body) return res.status(400).json("Post http data not provided");
  let { name, type, amount } = req.body;
  const create = new model.Transaction({
    name,
    type,
    amount,
    date: new Date(),
  });
  create.save();
  res.json(create);
  // console.log(create);
}

async function get_transaction(req, res) {
  let data = await model.Transaction.find({});
  res.send(data);
}

async function delete_transaction(req, res) {
  if (!req.body) res.status(400).json({ message: "Request body not found" });
  await model.Transaction.deleteOne(req.body)
    .then((result) => {
      res.send("done" + result);
    })
    .catch((errr) => {
      res.send(err);
    });
}

// get laebsl
async function get_labels(req, res) {
  model.Transaction.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "type",
        foreignField: "type",
        as: "categories_info",
      },
    },
    {
      $unwind: "$categories_info",
    },
  ])
    .then((result) => {
      // console.log(result);
      let data = result.map((value) =>
        Object.assign(
          {},
          {
            _id: value._id,
            name: value.name,
            amount: value.amount,
            type: value.type,
            color: value.categories_info["color"],
          }
        )
      );
      // console.log(data);
      res.json(data);
    })
    .catch((error) => {
      res.status(400).json("Lookup collection error" + error);
    });
}

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const File = require("../models/File.js");

function create(req, res) {
  console.log(req.file);
  // res.json(req.file);
  const allRecords = [];
  try {
    fs.createReadStream(
      path.join(__dirname, "../", "/public/csv/" + req.file.filename)
    )
      .pipe(csv.parse({headers : true}))
      .on("error", (err) => console.log(err))
      .on("data", (row) => {
        allRecords.push(row);
      })
      .on("end", async (rowCount) => {
        console.log(`${rowCount} rows has passed`);
        try {
          const user = await File.insertMany(allRecords);
          return res.json({
            message: "Users created successfully",
            user,
          });
        } catch (error) {
          console.log(error + " while inserting many data from csv file");
          return res.status(400).json(error);
        }
      });
  } catch (error) {
    res.status(400).json(error);
  }
}

module.exports = {
  create_categories,
  get_categories,
  create_transaction,
  get_transaction,
  delete_transaction,
  get_labels,
  create,
};
