const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const loginIm = require("../modules/users/login");
const checkTokenIm = require("../modules/users/checkToken");
const getCSRFIm = require("../modules/users/getCSRF");

const createIm = require("../modules/users/create");
const getIm = require("../modules/users/get");
const updateIm = require("../modules/users/update");
const deleteIm = require("../modules/users/delete");
const getAllIm = require("../modules/users/getAll");
const updatePasswordIm = require("../modules/users/updatePassword");

router.get("/checkToken", async (req, res) => {
  return wrapper(req, res, checkTokenIm);
});

router.get("/getCSRF", async (req, res) => {
  return wrapper(req, res, getCSRFIm);
});

router.post("/login", async (req, res) => {
  return wrapper(req, res, loginIm);
});

router.post("/create", async (req, res) => {
  return wrapper(req, res, createIm);
});

router.get("/get/:userId", async (req, res) => {
  return wrapper(req, res, getIm);
});
router.post("/update/:userId", async (req, res) => {
  return wrapper(req, res, updateIm);
});

router.post("/:user_id/delete", async (req, res) => {
  return wrapper(req, res, deleteIm);
});

router.get("/getAll/:search?", async (req, res) => {
  return wrapper(req, res, getAllIm);
});

router.post("/updatePassword/:userId", async (req, res) => {
  return wrapper(req, res, updatePasswordIm);
});

module.exports = router;
