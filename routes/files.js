const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const uploadIm = require("../modules/uploads/update");

router.post("/upload", async (req, res) => {
  return wrapper(req, res, uploadIm);
});

module.exports = router;
