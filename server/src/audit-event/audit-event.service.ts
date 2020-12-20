import AuditEventDAL from "./audit-event.dal";

export class AuditEventService {
  private auditEventDAL: AuditEventDAL;

  constructor() {
    this.auditEventDAL = new AuditEventDAL();
  }
}
