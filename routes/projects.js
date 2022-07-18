const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const createIm = require("../modules/projects/create");
const getIm = require("../modules/projects/get");
const getListIm = require("../modules/projects/getList");
const updateIm = require("../modules/projects/update");
const usersAddIm = require("../modules/projects/usersAdd");
const usersDeleteIm = require("../modules/projects/usersDelete");
const coverSheetIm = require("../modules/projects/coverSheetAdd");
const coverSheetGetIm = require("../modules/projects/coverSheetGet");

router.post("/create", async (req, res) => {
  return wrapper(req, res, createIm);
});

router.get("/get/:projectId", async (req, res) => {
  return wrapper(req, res, getIm);
});

router.post("/update/:projectId", async (req, res) => {
  return wrapper(req, res, updateIm);
});

router.post("/:projectId/users/add", async (req, res) => {
  return wrapper(req, res, usersAddIm);
});

router.post("/:projectId/users/delete", async (req, res) => {
  return wrapper(req, res, usersDeleteIm);
});

router.get("/getlist/:projectType", async (req, res) => {
  return wrapper(req, res, getListIm);
});

router.post("/:projectId/coversheet/add", async (req, res) => {
  return wrapper(req, res, coverSheetIm);
});

router.get("/:projectId/coversheet", async (req, res) => {
  return wrapper(req, res, coverSheetGetIm);
});

module.exports = router;
