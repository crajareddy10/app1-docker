const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const createIm = require("../modules/items/create");
const getIm = require("../modules/items/get");
const updateIm = require("../modules/items/update");
const deleteIm = require("../modules/items/delete");

router.post("/create", async (req, res) => {
  return wrapper(req, res, createIm);
});

router.get("/get/:categoryId/:co_id?", async (req, res) => {
  return wrapper(req, res, getIm);
});

router.post("/update/:itemId", async (req, res) => {
  return wrapper(req, res, updateIm);
});

router.post("/:itemId/delete", async (req, res) => {
  return wrapper(req, res, deleteIm);
});

module.exports = router;
