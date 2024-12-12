const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const port = 5001;

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "", 
  database: "events_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Get all events
app.get("/api/events", (req, res) => {
  db.query("SELECT * FROM events", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Error fetching events" });
    } else {
      res.json(results);
    }
  });
});

// Add a new event
app.post("/api/events", (req, res) => {
  const { title, description, date } = req.body;

  if (!title || !description || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newEvent = { title, description, date };
  
  db.query("INSERT INTO events SET ?", newEvent, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding event" });
    }
    res.status(201).json({ id: result.insertId, ...newEvent });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
