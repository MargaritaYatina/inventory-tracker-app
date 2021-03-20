// Module imports
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  dosage: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: false },
  inventory: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Inventory" },
  ],
});

module.exports = mongoose.model("Item", itemSchema);
