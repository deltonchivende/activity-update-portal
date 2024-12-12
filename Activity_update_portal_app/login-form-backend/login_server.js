const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5002;

// Middleware
app.use(cors({
  origin: 'http://192.168.137.1:19000', // Adjust according to your React app's URL
  methods: ["GET","POST"],
  credentials: true
}));
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Default MySQL username in XAMPP
  password: '', // Default password (if any)
  database: 'mydatabase' // Your database name
});

// Check MySQL connection
db.connect((err) => {
  if (err) {
    console.error('Could not connect to MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL!');
  }
});

// Login route
app.post('/api/login', (req, res) => {
  console.log('Received login request...');
  console.log('Request body:', req.body);  // Log the incoming request body

  const { email, password } = req.body;

  // Query MySQL to check if the user exists with matching credentials
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.length > 0) {
      console.log('Login successful for:', email);
      res.status(200).json({ message: 'Login successful!' });
    } else {
      console.log('Invalid credentials for:', email);
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://192.168.137.1:${port}`);
});
