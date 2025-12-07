const ibmdb = require("ibm_db");

const connStr = "DATABASE=bludb;" +
  "HOSTNAME=b0aebb68-94fa-46ec-a1fc-1c999edb6187.c3n41cmd0nqnrk39u98g.databases.appdomain.cloud;" +
  "PORT=31249;" +
  "PROTOCOL=TCPIP;" +
  "UID=nmy22973;" +
  "PWD=2TcvGYcbPh6X3MMl;" +
  "SECURITY=SSL;" +
  "CURRENTSCHEMA=NMY22973;"; // optional but recommended

ibmdb.open(connStr, (err, conn) => {
  if (err) {
    console.error("❌ DB2 Connection Failed:", err);
  } else {
    console.log("✅ DB2 Connected Successfully!");

    // optional: run a quick test query
    conn.query("SELECT 1 FROM SYSIBM.SYSDUMMY1", (err, data) => {
      if (err) console.error("❌ Test Query Failed:", err);
      else console.log("✅ Test Query Result:", data);

      conn.closeSync(); // close connection
    });
  }
});
