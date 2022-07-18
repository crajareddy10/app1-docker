const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const createIm = require("../modules/versions/create");

router.post("/create", async (req, res) => {
  return wrapper(req, res, createIm);
});

module.exports = router;
