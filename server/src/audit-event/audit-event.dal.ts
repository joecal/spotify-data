import AuditEvent, { DatabaseAction, IAuditEvent } from "./audit-event.model";
import { SpotifyDataDocumentType } from "../mongoose";

export default class AuditEventDAL {
  constructor() {
    this.init();
  }

  private init(): void {
    this.watchAuditEventCollection();
  }

  private watchAuditEventCollection(): void {
    // NOTE: This only works if you convert from default standalone to a replica set
    // Docs: https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/
    const auditEventWatch = AuditEvent.watch();
    auditEventWatch.on("change", (change) => {
      console.log("audit event change", JSON.stringify(change));
      // TODO: send socket message to connected useId/socketId/s
    });
  }

  async createAuditEvent(userId: string, databaseAction: DatabaseAction, documentType: SpotifyDataDocumentType): Promise<IAuditEvent> {
    return AuditEvent.create({
      userId,
      date: new Date(),
      databaseAction,
      documentType,
    })
      .then((audioEvent: IAuditEvent) => audioEvent)
      .catch((error: Error) => {
        throw error;
      });
  }
}
