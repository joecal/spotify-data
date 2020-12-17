import Database from "./database";
import App from "./app";

const database: Database = new Database();
const app: App = new App();

database.connect((error: any) => {
  if (error) {
    process.exit(1);
  } else {
    app.listen();
  }
});
