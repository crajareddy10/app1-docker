const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const newProjectOwnerIdIm = require("../modules/selects/newProject/ownerId");

router.get("/newProject/ownerId", async (req, res) => {
  return wrapper(req, res, newProjectOwnerIdIm);
});

module.exports = router;
