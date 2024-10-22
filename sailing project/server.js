const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/sailing_trips', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Trip Schema
const tripSchema = new mongoose.Schema({
  name: String,
  date: Date,
  destination: String,
  userId: String, // To associate trips with users
});

const Trip = mongoose.model('Trip', tripSchema);

// Routes
app.post('/api/trips', async (req, res) => {
  try {
    const { name, date, destination, userId } = req.body;
    const newTrip = new Trip({ name, date, destination, userId });
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/trips/:userId', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});