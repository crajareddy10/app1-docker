const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const createIm = require("../modules/subitems/create");
const getIm = require("../modules/subitems/get");
const updateIm = require("../modules/subitems/update");
const deleteIm = require("../modules/subitems/delete");

router.post("/create", async (req, res) => {
  return wrapper(req, res, createIm);
});

router.get("/get/:itemId/:logId", async (req, res) => {
  return wrapper(req, res, getIm);
});

router.get("/get/:itemId", async (req, res) => {
  return wrapper(req, res, getIm);
});

router.get("/getlog/:logId/:typeId", async (req, res) => {
  return wrapper(req, res, getIm);
});

router.post("/update/:subitemId", async (req, res) => {
  return wrapper(req, res, updateIm);
});

router.post("/:subitem_id/delete", async (req, res) => {
  return wrapper(req, res, deleteIm);
});

module.exports = router;
