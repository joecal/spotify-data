import mongoose, { Mongoose } from "mongoose";
import config from "../config";

type DatabaseState = {
  db: Mongoose | null;
};

const databaseState: DatabaseState = {
  db: null,
};

export default class Database {
  async connect(callback: Function): Promise<any> {
    return new Promise(async (resolve) => {
      if (databaseState.db) {
        resolve(callback());
      } else {
        try {
          const mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          };
          const connection: Mongoose = await mongoose.connect(config.mongoURL, mongoOptions);
          console.log(`Database connected to ${config.mongoURL}`);
          databaseState.db = connection;
          resolve(callback());
        } catch (error: any) {
          console.error(`Error connecting to database ${config.mongoURL}: `, error);
          resolve(callback(error));
        }
      }
    });
  }

  getDB(): Mongoose | null {
    return databaseState.db;
  }

  getObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }
}
