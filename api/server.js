const express = require("express");

const server = express();

server.get("/", (req, res) => {
  res.send(`<h2>Sprint Challenge, woo!</h2>`);
});

const event = new Date();

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl} at ${event.toISOString()}`);
}

server.use(express.json());
server.use(logger);

module.exports = server;
