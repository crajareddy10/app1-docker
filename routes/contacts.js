const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const createIm = require("../modules/contacts/create");
const getIm = require("../modules/contacts/get");
const updateIm = require("../modules/contacts/update");
const deleteIm = require("../modules/contacts/delete");

router.post("/create", async (req, res) => {
  return wrapper(req, res, createIm);
});

router.get("/get/:search?", async (req, res) => {
  return wrapper(req, res, getIm);
});

router.post("/update/:contactId", async (req, res) => {
  return wrapper(req, res, updateIm);
});

router.post("/:company_id/delete", async (req, res) => {
  return wrapper(req, res, deleteIm);
});

module.exports = router;
