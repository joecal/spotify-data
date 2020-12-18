import mongoose, { Schema } from "mongoose";

export enum DatabaseAction {
  insert = "insert",
  update = "update",
  delete = "delete",
}

export interface IAuditEvent {
  userId: string;
  date: Date;
  databaseAction: DatabaseAction;
}

const AuditEvent: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  databaseAction: { type: DatabaseAction, required: true },
});

export default mongoose.model("AuditEvent", AuditEvent);
