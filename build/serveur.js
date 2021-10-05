const express = require("express")();
const http = require("http").Server(express);
const serveStatic = require("serve-static");
const path = require("path");
const port = process.env.PORT || 3000;
const io = require("socket.io")(http);

var allFunction = {
  listSocket: {},

  addSocket: function(socket, username) {
    this.listSocket[username] = socket;
  },

  deleteSocket: function(username) {
    if (this.listSocket[username] != undefined) {
      delete this.listSocket[username];
    }
  },

  getSocket: function(username) {
    if (this.listSocket[username] != undefined) {
      return this.listSocket[username];
    }
  },
};

express.use(serveStatic(path.join(__dirname, "/dist")));

io.on("connection", (socket) => {
  socket.on("con", (data) => {
    allFunction.addSocket(socket, data);
  });

  socket.on("sendMsg", (data) => {
    allFunction.getSocket(data.to).emit("receiveMgs", data.msg);
  });

  socket.on("decon", (user) => {
    allFunction.deleteSocket(user);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");

    console.log(allFunction.listSocket);
  });
});

http.listen(port, function() {
  console.log("running on port : " + port);
});
