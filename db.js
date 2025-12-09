const ibmdb = require("ibm_db");
require("dotenv").config();

const connStr =
  `DATABASE=${process.env.DB_DATABASE};` +
  `HOSTNAME=${process.env.DB_HOSTNAME};` +
  `PORT=${process.env.DB_PORT};` +
  `PROTOCOL=${process.env.DB_PROTOCOL};` +
  `UID=${process.env.DB_UID};` +
  `PWD=${process.env.DB_PWD};` +
  `SECURITY=${process.env.DB_SECURITY};` +
  `CURRENTSCHEMA=${process.env.DB_SCHEMA};`;

async function connectDB() {
  try {
    const conn = await ibmdb.open(connStr);
    console.log("✅ DB2 Connected Successfully!");
    return conn;
  } catch (err) {
    console.error("❌ DB2 Connection Failed:", err);
    throw err;
  }
}

module.exports = connectDB;

// ✅ TEST CONNECTION when running directly
if (require.main === module) {
  (async () => {
    try {
      const conn = await connectDB();
      // Example query to verify
      const result = await conn.query("SELECT CURRENT TIMESTAMP FROM SYSIBM.SYSDUMMY1");
      console.log("Query result:", result);
      await conn.close();
      console.log("DB2 connection closed!");
    } catch (err) {
      console.error("Error during test:", err);
    }
  })();
}
