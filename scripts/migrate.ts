import "dotenv/config";
import fs from "fs";
import path from "path";
import postgres from "postgres";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error(
      "DATABASE_URL is not set. Add your Postgres connection string to .env first."
    );
    process.exit(1);
  }

  const sql = postgres(connectionString, { ssl: "require" });
  const schema = fs.readFileSync(path.join(__dirname, "../lib/schema.sql"), "utf-8");

  console.log("Running migration...");
  await sql.unsafe(schema);
  console.log("Migration complete — tables are ready.");
  await sql.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
