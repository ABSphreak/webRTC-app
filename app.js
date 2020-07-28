const express = require("express");
// Initialize Express Server
const app = express();
// Setting up an HTTP server
const server = require("http").Server(app);
// Adding server to be used in socket.io
const io = require("socket.io")(server);
// For creating unique IDs for rooms
const { v4: uuidV4 } = require("uuid");

// Using EJS as our view engine
app.set("view engine", "ejs");
// Setting up Static folder
app.use(express.static("public"));

// Directly setting up a room
app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

// passing in the room in the parameter
// will render that room
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(5000);
