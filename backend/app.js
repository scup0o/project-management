const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");
var path = require("path");

app.use(cors());
app.use(cookieParser());
app.use(express.static(__dirname));
app.set("view engine", "ejs");
app.use(fileUpload());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

//routes
const userRouter = require("./app/routes/user.route");
const doctypeRouter = require("./app/routes/doctype.route");
const projectRouter = require("./app/routes/project.route");
const fileRouter = require("./app/routes/file.route");
const eventRouter = require("./app/routes/event.route");
const settingiRouter = require("./app/routes/settingi.route");

app.use("/api/user", userRouter);
app.use("/api/doctype", doctypeRouter);
app.use("/api/project", projectRouter);
app.use("/api/file", fileRouter);
app.use("/api/event", eventRouter);
app.use("/api/settingi", settingiRouter);
/*
app.get("/", (req, res) => {
  res.json({ message: "projectmanagement" });
});

//404
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});*/

/*app.use(
  "/static",
  express.static(path.join(__dirname, "../public/dist/static/"))
);*/

var serveStatic = require('serve-static')

app.use(express.static('assets'))

app.use(serveStatic(path.join(__dirname, "public/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dist/index.html"));
});

module.exports = app;
