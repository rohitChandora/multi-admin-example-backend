import createHttpError from "http-errors";
import http from "http";
import { WebSocketServer } from "ws";

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
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.send(JSON.stringify({ message: "Welcome, client!" }));

  // Listen to messages from client
  ws.on("message", (data) => {
    console.log("Received from client:", data.toString());
    // Echo the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

export { app, server };
