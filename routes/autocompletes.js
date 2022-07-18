const router = require("express").Router();
const wrapper = require("../utils/Wrapper");

const projectClientIdIm = require("../modules/autocompletes/project/clientId");
const projectContactIdIm = require("../modules/autocompletes/project/contactId");
const projectItemIdIm = require("../modules/autocompletes/project/itemId");
const projectCategoryIdIm = require("../modules/autocompletes/project/categoryId");

// project
router.get("/project/clientId/:search?/:exact?", async (req, res) => {
  return wrapper(req, res, projectClientIdIm);
});

router.get("/project/contactId/:search?/:exact?", async (req, res) => {
  return wrapper(req, res, projectContactIdIm);
});

router.get("/project/categoryId/:search?/:exact?", async (req, res) => {
  return wrapper(req, res, projectCategoryIdIm);
});

router.get("/project/itemId/:search?/:exact?", async (req, res) => {
  return wrapper(req, res, projectItemIdIm);
});

module.exports = router;
