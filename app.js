const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

app.use("*", (_req, res) => {
  res.send("WebSocket server");
});

let users = {};

io.on("connection", (client) => {
  users[client.id] = "Anonim";
  broadcast("users", users);

  client.on("change:name", (name) => {
    users[client.id] = name;
    broadcast("users", users);
  });

  client.on("message", (message) => {
    broadcast("message", message);
  });

  client.on("disconnect", () => {
    delete users[client.id];
    broadcast("users", users);
  });

  function broadcast(event, data) {
    client.emit(event, data);
    client.broadcast.emit(event, data);
  }
});

const PORT = process.env.PORT || 5737;

http.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
