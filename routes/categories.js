const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const createIm = require("../modules/categories/create");
const getIm = require("../modules/categories/get");
const updateIm = require("../modules/categories/update");
const deleteIm = require("../modules/categories/delete");
const getByTemplateIm = require("../modules/categories/getByTemplate");

router.post("/create", async (req, res) => {
  return wrapper(req, res, createIm);
});

router.get("/get/:projectId/:co_id?", async (req, res) => {
  return wrapper(req, res, getIm);
});

router.post("/update/:categoryId", async (req, res) => {
  return wrapper(req, res, updateIm);
});

router.post("/:categoryId/delete", async (req, res) => {
  return wrapper(req, res, deleteIm);
});

router.get("/getByTemplateId/:templateId", async (req, res) => {
  return wrapper(req, res, getByTemplateIm);
});

module.exports = router;
