// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000; // Default to port 5000 if not set in .env

console.log("MongoDB URI:", process.env.MONGODB_URI);  // Log the MongoDB URI to check if it's correct


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Serve your frontend files (index.html)
app.use(express.static('public')); // Make sure index.html is in the 'public' directory

// Set up a simple API endpoint (example)
app.get('/api/rooms', (req, res) => {
  // This can be a placeholder endpoint until you implement more logic
  res.json({ message: 'Welcome to the Music Room API!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


const Room = require('./models/roomModel');  // Import the room model

// POST request to create a new room
app.post('/create-room', async (req, res) => {
    try {
        const roomId = Math.random().toString(36).substring(7); // Generate a unique room ID
        const newRoom = new Room({
            roomId,
            users: [],  // Initially, no users in the room
            songs: []   // Initially, no songs in the room
        });
        
        await newRoom.save();
        res.status(201).json({ roomId: newRoom.roomId });  // Send back the room ID to the client
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create room' });
    }
});

// POST request to join an existing room
app.post('/join-room/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const { username } = req.body;

  try {
      const room = await Room.findOne({ roomId });

      if (!room) {
          return res.status(404).json({ error: 'Room not found' });
      }

      // Add the user to the room
      room.users.push({ username });
      await room.save();

      res.status(200).json({ message: `User ${username} joined room ${roomId}` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to join room' });
  }
});

// POST request to add a song to the room
app.post('/add-song/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const { songTitle, artist, url } = req.body;

  try {
      const room = await Room.findOne({ roomId });

      if (!room) {
          return res.status(404).json({ error: 'Room not found' });
      }

      // Add the song to the room
      room.songs.push({ songTitle, artist, url });
      await room.save();

      res.status(200).json({ message: `Song added to room ${roomId}` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add song' });
  }
});

// GET request to get room details
app.get('/room/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
      const room = await Room.findOne({ roomId });

      if (!room) {
          return res.status(404).json({ error: 'Room not found' });
      }

      res.status(200).json(room);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve room details' });
  }
});

