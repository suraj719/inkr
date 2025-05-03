require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const parser = require("socket.io-msgpack-parser");

const CLIENT_URL = "http://localhost:5173";
const PORT = 5000;

app.use(
  cors({
    origin: [CLIENT_URL],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  parser,
  cors: {
    origin: [CLIENT_URL],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("leave", (room) => {
    socket.leave(room);
  });

  socket.on("getElements", ({ elements, room }) => {
    socket.to(room).emit("setElements", elements);
  });

  socket.on("chatMessage", ({ message, room }) => {
    io.to(room).emit("chatMessage", message);
  });
});

app.get("/", (req, res) => {
  res.send("Hola!");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
