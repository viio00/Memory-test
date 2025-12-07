
const express = require("express");
const cors = require("cors");
const path = require("path"); 
const connectDB = require("./db");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/register", async (req, res) => {
  const { name, email, age, program } = req.body;

  try {
    const conn = await connectDB();

    await conn.query(
      `INSERT INTO participant (name, email, age, program)
       VALUES (?, ?, ?, ?)`,
      [name, email, age, program]
    );

    await conn.query("COMMIT");
    
    conn.closeSync();
    res.send("✅ Participant Registered Successfully!");

  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).send("❌ Database Error");
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
