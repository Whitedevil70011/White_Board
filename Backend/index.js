const express = require('express');
const app = express();
const connectDB = require('./db');
const http = require('http');                        // 1. Import http
const { Server } = require('socket.io');             // 2. Correct import

const server = http.createServer(app);               // 3. Wrap express in http server
const io = new Server(server, {                      // 4. Pass http server to socket.io
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

connectDB();
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});

const userRoute = require("./routes/userRoute");
app.use("/user", userRoute);

const registerRoute = require("./routes/registerRoute");
app.use("/register", registerRoute);

const postRoute = require("./routes/postRoute");
app.use("/post", postRoute);

const canvasRoute = require("./routes/canvasRoute");
app.use("/canvas", canvasRoute);


const Canvas = require('./Models/canvasModel');

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle join_canvas event from client
  socket.on('join_canvas', async ({ canvasId }) => {
    try {
      // Optionally: socket.join(canvasId); // for room-based features
      const canvas = await Canvas.findById(canvasId);
      if (!canvas) {
        socket.emit('load_canvas_error', { message: 'Canvas not found' });
        return;
      }
      socket.emit('load_canvas', canvas);
    } catch (err) {
      socket.emit('load_canvas_error', { message: err.message || 'Failed to load canvas' });
    }
  });

  // Example: listen for a custom event
  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data);                        // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

server.listen(3030, () => {                          // 5. Use `server`, not `app`
  console.log("Server is running on http://localhost:3030");
});