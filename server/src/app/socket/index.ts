import http from "http";
const io = require("socket.io");

export default class Socket {
  socket: any;

  constructor(httpServer: http.Server) {
    this.socket = io(httpServer, {
      transports: ["websocket", "polling"],
      cors: {
        origin: "*",
      },
    });
  }
}
