// Module imports
const express = require("express");
const { check } = require("express-validator");

// Local imports
const itemControllers = require("../controllers/items-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// Prevent unauthorized access
router.use(checkAuth);

// Route controllers
//GET////////////////////////////////////////////////////////////////////////////////
router.get("/:itemName", itemControllers.getItemByName);

router.get("/inventory/:invId", itemControllers.getItemsByInventoryId);

//POST///////////////////////////////////////////////////////////////////////////////
router.post(
  "/:invId",
  fileUpload.single("image"),
  [
    check("name").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("category").isLength({ min: 3 }),
    check("dosage").isNumeric(),
    check("quantity").isNumeric(),
  ],
  itemControllers.createItem
);

//PATCH//////////////////////////////////////////////////////////////////////////////
router.patch(
  "/:itemId",
  [
    check("name").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("category").isLength({ min: 3 }),
    check("dosage").isNumeric(),
    check("quantity").isNumeric(),
  ],
  itemControllers.updateItem
);

//DELETE/////////////////////////////////////////////////////////////////////////////
router.delete("/:itemId", itemControllers.deleteItem);

module.exports = router;
