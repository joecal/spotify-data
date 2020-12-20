import http from "http";
const io = require("socket.io");

export default class Socket {
  socket: typeof io;

  constructor(private httpServer: http.Server) {
    this.socket = io(this.httpServer, {
      transports: ["websocket", "polling"],
      cors: {
        origin: "*",
      },
    });
  }
}
