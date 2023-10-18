const express = require("express");
const cors = require("cors");
const { router: routes } = require("./routes");
const {
  ErrorType,
  ApiError,
  NotFoundError,
  InternalError,
} = require("./core/ApiError");
const { corsUrl, environment } = require("./config");
const Logger = require("./core/Logger");

const app = express();

app.use(express.json());
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use("/", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// catch 503 and middleware error handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    Logger.error(
      `${err.name} - ${err.type} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return ApiError.handle(err, res);
  } else {
    Logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );

    if (environment === "development") {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
});

module.exports = app;
