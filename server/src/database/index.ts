import mongoose, { Mongoose } from "mongoose";
import config from "../config";

type DatabaseState = {
  db: Mongoose | null;
};

export default class Database {
  private databaseState: DatabaseState;

  constructor() {
    this.databaseState = {
      db: null,
    };
  }

  async connect(): Promise<boolean | Error> {
    return new Promise(async (resolve, reject) => {
      if (this.databaseState.db) {
        resolve(true);
      } else {
        try {
          const mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
          };
          const connection: Mongoose = await mongoose.connect(config.mongoURL, mongoOptions);
          console.log(`Database connected to ${config.mongoURL}`);
          this.databaseState.db = connection;
          resolve(true);
        } catch (error: any) {
          console.error(`Error connecting to database ${config.mongoURL}: `, error);
          reject(error);
        }
      }
    });
  }
}
