// Module imports
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Local Imports
const HttpError = require("../models/http-error");
const Inventory = require("../models/inventory");
const User = require("../models/user");

// Route controllers
//GET////////////////////////////////////////////////////////////////////////////////
const getInventoryByName = async (req, res, next) => {
  const inventoryName = req.params.invName;
  console.log(inventoryName);

  let inventory;
  try {
    Inventory.find({ name: inventoryName }).then(
      (results) => (inventory = results)
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find the inventory.",
      500
    );
    return next(error);
  }

  if (!inventory) {
    const error = new HttpError(
      "Could not find inventory with the provided name.",
      404
    );
    return next(error);
  }

  res.json({ inventories: inventory.toObject({ getters: true }) });
};

//GET////////////////////////////////////////////////////////////////////////////////
const getInventoriesByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  let inventoryOwner;
  try {
    inventoryOwner = await User.findById(userId).populate("inventories");
  } catch (err) {
    const error = new HttpError(
      "Fetching inventories failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!inventoryOwner) {
    return next(new HttpError("Could not find the provided user id.", 404));
  }

  res.json({
    inventories: inventoryOwner.inventories.map((inventory) =>
      inventory.toObject({ getters: true })
    ),
  });
};

//POST///////////////////////////////////////////////////////////////////////////////
const createInventory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input, please check your data.", 422));
  }

  const { name, description } = req.body;

  const createdInventory = new Inventory({
    name,
    description,
    creator: req.userData.userId,
    items: [],
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating inventory failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdInventory.save({ session: sess });
    user.inventories.push(createdInventory);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating inventory failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ inventory: createdInventory });
};

//PATCH//////////////////////////////////////////////////////////////////////////////
const updateInventory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, description } = req.body;
  const inventoryId = req.params.invId;

  let inventory;
  try {
    inventory = await Inventory.findById(inventoryId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update inventory.",
      500
    );
    return next(error);
  }

  // TODO: add inventory.access.find(user => user === req.userData.userId)
  if (inventory.owner.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this inventory.",
      401
    );
    return next(error);
  }

  inventory.name = name;
  inventory.description = description;

  try {
    await inventory.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update inventory.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    inventory: inventory.toObject({ getters: true }),
  });
};

//DELETE/////////////////////////////////////////////////////////////////////////////
const deleteInventory = async (req, res, next) => {
  const inventoryId = req.params.invId;

  let inventory;
  try {
    inventory = await Inventory.findById(inventoryId).populate("owner");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete inventory.",
      500
    );
    return next(error);
  }

  if (!inventory) {
    const error = new HttpError("Could not find inventory for this id.", 404);
    return next(error);
  }

  // TODO: add inventory.access.find(user => user === req.userData.userId)
  if (inventory.owner.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this inventory.",
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await inventory.remove({
      session: sess,
    });
    inventory.owner.inventories.pull(inventory);
    await inventory.owner.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete inventory.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Deleted inventory.",
  });
};

exports.getInventoryByName = getInventoryByName;
exports.getInventoriesByUserId = getInventoriesByUserId;
exports.createInventory = createInventory;
exports.updateInventory = updateInventory;
exports.deleteInventory = deleteInventory;
