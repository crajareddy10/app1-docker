const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  req.context = {};
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const usersRouter = require("./routes/users.js");
const autocompletesRouter = require("./routes/autocompletes.js");
const categoriesRouter = require("./routes/categories.js");
const companiesRouter = require("./routes/companies.js");
const contactsRouter = require("./routes/contacts.js");
const filesRouter = require("./routes/files.js");
const itemsRouter = require("./routes/items.js");
const logsRouter = require("./routes/logs.js");
const projectsRouter = require("./routes/projects.js");
const selectsRouter = require("./routes/selects.js");
const subitemsRouter = require("./routes/subitems.js");
const templatesRouter = require("./routes/templates.js");
const versionsRouter = require("./routes/versions.js");

app.use("/users", usersRouter);
app.use("/autocompletes", autocompletesRouter);
app.use("/categories", categoriesRouter);
app.use("/companies", companiesRouter);
app.use("/contacts", contactsRouter);
app.use("/files", filesRouter);
app.use("/items", itemsRouter);
app.use("/logs", logsRouter);
app.use("/projects", projectsRouter);
app.use("/selects", selectsRouter);
app.use("/subitems", subitemsRouter);
app.use("/templates", templatesRouter);
app.use("/template", templatesRouter);
app.use("/versions", versionsRouter);

//Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is working!" });
});

app.listen(3000, () => {
  console.log("Server is up on 3000");
});
