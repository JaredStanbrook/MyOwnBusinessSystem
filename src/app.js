var createError = require("http-errors");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var path = require("path");

var indexRouter = require("./api/routes/index");
var invoiceRouter = require("./api/routes/invoice");
var clientRouter = require("./api/routes/client");

const connectDB = require("../config/db");

connectDB();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "dist")));
app.use(bodyParser.json());

app.use(path.join("/", process.env.APP_NAME, "invoices"), invoiceRouter);
app.use(path.join("/", process.env.APP_NAME, "clients"), clientRouter);
app.use(path.join("/", process.env.APP_NAME), indexRouter);

//Base Page
app.get("/", function (req, res, next) {
    res.redirect('/mobs');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;