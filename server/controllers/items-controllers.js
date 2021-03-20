// Standard imports
const fs = require("fs");

// Module imports
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Local Imports
const HttpError = require("../models/http-error");
const Item = require("../models/item");
const Inventory = require("../models/inventory");

// Route controllers
//GET////////////////////////////////////////////////////////////////////////////////
const getItemByName = async (req, res, next) => {
  const itemName = req.params.itemName;

  let item;
  try {
    Item.find({ name: itemName }).then((results) => (item = results));
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find the item.",
      500
    );
    return next(error);
  }

  if (!item) {
    const error = new HttpError(
      "Could not find item for the provided name.",
      404
    );
    return next(error);
  }

  res.json({ item: item.toObject({ getters: true }) });
};

//GET////////////////////////////////////////////////////////////////////////////////
const getItemsByInventoryId = async (req, res, next) => {
  const invId = req.params.invId;

  let itemInventory;
  try {
    itemInventory = await Inventory.findById(invId).populate("items");
  } catch (err) {
    const error = new HttpError(
      "Fetching items failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!itemInventory) {
    return next(
      new HttpError("Could not find the provided inventory id.", 404)
    );
  }

  if (itemInventory.items.length === 0) {
    return res.json({ items: {} });
  }

  res.json({
    items: itemInventory.items.map((item) => item.toObject({ getters: true })),
  });
};

//POST///////////////////////////////////////////////////////////////////////////////
const createItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input, please check your data.", 422));
  }

  const { name, description, category, dosage, quantity } = req.body;

  const createdItem = new Item({
    name,
    description,
    category,
    dosage,
    quantity,
    image: req.file.path,
    owner: req.userData.userId,
    inventory: req.params.itemId,
    date: Date.now(),
  });

  let inventory;
  let user;
  try {
    inventory = await Inventory.findById(req.params.invId);
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating item failed, please try again.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("An unknown error occured!.", 500);
    return next(error);
  }
  if (!inventory) {
    const error = new HttpError(
      "Could not find inventory for provided id.",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdItem.save({ session: sess });
    inventory.items.push(createdItem);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating item failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ item: createdItem });
};

//PATCH/////////////////////////////////////////////////////////////////////////////
const updateItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input, please check your data.", 422));
  }

  const { name, description, category, dosage, quantity } = req.body;
  const itemId = req.params.itemId;

  let item;
  try {
    item = await Item.findById(itemId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update item.",
      500
    );
    return next(error);
  }

  if (item.owner.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this item.", 401);
    return next(error);
  }

  item.name = name;
  item.description = description;
  item.category = category;
  item.dosage = dosage;
  item.quantity = quantity;

  try {
    await item.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update item.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    item: item.toObject({ getters: true }),
  });
};

//DELETE/////////////////////////////////////////////////////////////////////////////
const deleteItem = async (req, res, next) => {
  const itemId = req.params.itemId;

  let item;
  try {
    item = await Item.findById(itemId).populate("owner");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete item.",
      500
    );
    return next(error);
  }

  if (!item) {
    const error = new HttpError("Could not find item for this id.", 404);
    return next(error);
  }

  if (item.owner.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this item.",
      401
    );
    return next(error);
  }

  const imagePath = item.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await item.remove({
      session: sess,
    });
    item.inventory.items.pull(item);
    await item.inventory.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete item.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({
    message: "Deleted item.",
  });
};

exports.getItemByName = getItemByName;
exports.getItemsByInventoryId = getItemsByInventoryId;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
