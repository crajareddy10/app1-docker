const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const createIm = require("../modules/templates/create");
const getIm = require("../modules/templates/get");
const updateIm = require("../modules/templates/update");
const detailIm = require("../modules/templates/detail");

router.post("/create", async (req, res) => {
  return wrapper(req, res, createIm);
});

router.get("/get/:templateId", async (req, res) => {
  return wrapper(req, res, detailIm);
});

router.get("/get", async (req, res) => {
  return wrapper(req, res, getIm);
});

router.post("/update/:templateId", async (req, res) => {
  return wrapper(req, res, updateIm);
});

module.exports = router;
