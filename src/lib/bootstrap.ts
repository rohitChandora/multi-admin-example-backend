import createHttpError from "http-errors";
const express = require("express");

express.response.success = function (data: any, message = "Success") {
  return this.status(200).json({ success: true, message, data });
};

express.response.error = function (err: any, context?: Record<string, any>) {
  let httpError = err;

  // If the error is not an instance of createHttpError, wrap it as a generic 500 error
  if (!(err instanceof createHttpError.HttpError)) {
    httpError = new createHttpError.InternalServerError("Something went wrong");
  }

  return this.status(httpError.status).json({
    success: false,
    message: httpError?.message,
    context,
  });
};

const app = express();
export default app;
