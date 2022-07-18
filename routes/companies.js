const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const createIm = require("../modules/companies/create");
const getIm = require("../modules/companies/get");
const updateIm = require("../modules/companies/update");
const deleteIm = require("../modules/companies/delete");

router.post("/create", async (req, res) => {
  return wrapper(req, res, createIm);
});

router.get("/get/:search?", async (req, res) => {
  return wrapper(req, res, getIm);
});

router.post("/update/:companyId", async (req, res) => {
  return wrapper(req, res, updateIm);
});

router.post("/:company_id/delete", async (req, res) => {
  return wrapper(req, res, deleteIm);
});

module.exports = router;
