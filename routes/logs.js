const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const createIm = require("../modules/logs/create");
const getIm = require("../modules/logs/get");
const updateIm = require("../modules/logs/update");

router.post("/:tableName/create", async (req, res) => {
  return wrapper(req, res, createIm);
});

router.get("/get/:tableName/:projectId/:search?", async (req, res) => {
  return wrapper(req, res, getIm);
});

router.post("/update/:tableName/:logId", async (req, res) => {
  return wrapper(req, res, updateIm);
});

module.exports = router;
