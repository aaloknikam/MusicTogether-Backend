const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,  // Ensure the room ID is unique
    },
    users: [{
        username: String,
        joinedAt: {
            type: Date,
            default: Date.now,
        }
    }],
    songs: [{
        songTitle: String,
        artist: String,
        url: String,  // URL to the song file (could be a link or a path in the database)
    }]
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
