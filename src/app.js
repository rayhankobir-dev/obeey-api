const express = require("express");
const cors = require("cors");
const { router: routes } = require("./routes");
const { corsUrl, environment } = require("./config");
const {
  ErrorType,
  ApiError,
  NotFoundError,
  InternalError,
} = require("./core/ApiError");

const app = express();

app.use(express.json());

app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use("/", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// middleware error handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === "development") console.error(err);
    ApiError.handle(new InternalError(err.message), res);
  }
});

module.exports = app;
