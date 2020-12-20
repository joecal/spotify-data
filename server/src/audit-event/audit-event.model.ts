import mongoose, { Schema } from "mongoose";
import { SpotifyDataDocumentType } from "../mongoose";

export enum DatabaseAction {
  insert = "insert",
  insertMany = "insertMany",
  update = "update",
  updateMany = "updateMany",
  delete = "delete",
  deleteMany = "deleteMany",
}

export interface IAuditEvent {
  userId: string;
  date: Date;
  databaseAction: DatabaseAction;
  documentType: SpotifyDataDocumentType;
}

const AuditEventSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  databaseAction: { type: DatabaseAction, required: true },
  documentType: { type: SpotifyDataDocumentType, required: true },
});

export default mongoose.model<IAuditEvent & mongoose.Document<IAuditEvent>>("AuditEvent", AuditEventSchema);
