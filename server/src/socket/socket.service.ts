import Socket from "./";
import { Client } from "socket.io/dist/client";
import http from "http";
const io = require("socket.io");

interface SocketUserIdsDict {
  [key: string]: string;
}

export default class SocketService {
  socket: typeof io;

  private socketUserIdsDict: SocketUserIdsDict;

  constructor(private httpServer: http.Server) {
    this.socket = new Socket(this.httpServer).socket;
    this.socketUserIdsDict = {};
    this.init();
  }

  private init(): void {
    this.socketListeners();
  }

  private socketListeners(): void {
    this.socket.on("connection", (client: Client) => {
      const userId = (client as any).handshake.query["user-id"];

      console.log("socket connect user id ", userId);

      this.socketUserIdsDict[userId] = userId;

      (client as any).on("disconnect", () => {
        console.log("socket disconnect user id: ", userId);
        delete this.socketUserIdsDict[userId];
      });
    });
  }
}
