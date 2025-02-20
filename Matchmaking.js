mkdir skill-swap-platform
cd skill-swap-platform
npm init -y
npm install express mongoose socket.io     <script src="/socket.io/socket.io.js"></script>
<script>
    const socket = io();

    // Send a message to the backend
    document.getElementById('sendMessage').onclick = () => {
        const message = document.getElementById('messageInput').value;
        socket.emit('chatMessage', message);
    };

    // Listen for incoming chat messages
    socket.on('chatMessage', (msg) => {
        const chatWindow = document.getElementById('chatWindow');
        const messageDiv = document.createElement('div');
        messageDiv.textContent = msg;
        chatWindow.appendChild(messageDiv);
    });
</script>      // Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Initialize the app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skillSwap', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the User schema and model
const userSchema = new mongoose.Schema({
  name: String,
  skills: [String],
  interests: [String],
  profilePicture: String,
});

const User = mongoose.model('User', userSchema);

// Serve static files (for images, etc.)
app.use(express.static('public'));

// Routes

// Endpoint to save user profile
app.post('/save-profile', async (req, res) => {
  const { name, skills, interests, profilePicture } = req.body;
  try {
    const newUser = new User({ name, skills, interests, profilePicture });
    await newUser.save();
    res.status(200).send('Profile saved successfully!');
  } catch (err) {
    res.status(500).send('Error saving profile');
  }
});

// Endpoint to fetch users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

// Matchmaking API (find users based on skills and interests)
app.get('/match', async (req, res) => {
  const { skills, interests } = req.query;

  try {
    const matchedUsers = await User.find({
      skills: { $in: skills.split(',') },
      interests: { $in: interests.split(',') },
    });

    res.json(matchedUsers);
  } catch (err) {
    res.status(500).send('Error finding matches');
  }
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle user sending a message
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg); // Broadcast to all connected clients
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
}); 
