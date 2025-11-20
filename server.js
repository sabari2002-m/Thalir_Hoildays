require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Routes

// Get all destinations
app.get('/api/destinations', (req, res) => {
  db.all('SELECT * FROM destinations ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get destination by ID
app.get('/api/destinations/:id', (req, res) => {
  db.get('SELECT * FROM destinations WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Get all packages
app.get('/api/packages', (req, res) => {
  const query = `
    SELECT p.*, d.name as destination_name, d.state 
    FROM packages p 
    LEFT JOIN destinations d ON p.destination_id = d.id 
    ORDER BY d.name, p.price
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get packages by destination
app.get('/api/packages/destination/:destinationId', (req, res) => {
  const query = `
    SELECT p.*, d.name as destination_name, d.state 
    FROM packages p 
    LEFT JOIN destinations d ON p.destination_id = d.id 
    WHERE p.destination_id = ?
  `;
  
  db.all(query, [req.params.destinationId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get package by ID
app.get('/api/packages/:id', (req, res) => {
  const query = `
    SELECT p.*, d.name as destination_name, d.state, d.description as dest_description 
    FROM packages p 
    LEFT JOIN destinations d ON p.destination_id = d.id 
    WHERE p.id = ?
  `;
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Create a new booking
app.post('/api/bookings', (req, res) => {
  const { 
    package_id, 
    customer_name, 
    email, 
    phone, 
    travel_date, 
    num_adults, 
    num_children, 
    special_requests 
  } = req.body;

  // Validation
  if (!customer_name || !email || !phone || !travel_date || !num_adults) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const query = `
    INSERT INTO bookings 
    (package_id, customer_name, email, phone, travel_date, num_adults, num_children, special_requests) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [package_id, customer_name, email, phone, travel_date, num_adults, num_children || 0, special_requests || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        success: true,
        booking_id: this.lastID,
        message: 'Booking inquiry submitted successfully!'
      });
    }
  );
});

// Get all bookings (admin)
app.get('/api/bookings', (req, res) => {
  const query = `
    SELECT b.*, p.title as package_title, d.name as destination_name
    FROM bookings b
    LEFT JOIN packages p ON b.package_id = p.id
    LEFT JOIN destinations d ON p.destination_id = d.id
    ORDER BY b.created_at DESC
  `;

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Update booking status (admin)
app.put('/api/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  
  db.run(
    'UPDATE bookings SET status = ? WHERE id = ?',
    [status, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, message: 'Status updated' });
    }
  );
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/packages', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'packages.html'));
});

app.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'booking.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
