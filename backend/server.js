const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');

dotenv.config();

connectDB();

const jwtSecret = process.env.JWT_SECRET;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

async function getUserData(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                resolve(userData);
            });
        } else {
            reject('No token');
        }
    });
}

app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData);
        });

    } else {
        res.status(401).json('No token');
    }
});


app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// ----------------Deplyment -------------------
const __dirname1 = path.resolve(__dirname, "..");
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "/frontend/dist")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
    });
} else {
    app.get('/', (req, res) => {
        res.send("API is running");
    });
}
// ----------------Deplyment -------------------


const port = process.env.PORT || 3000;
const server = app.listen(3000, () => {
    console.log(`Listening on port ${port}`);
});

const io = require('socket.io')(server, {
    //amount of time it will wait while being inactive. If for 60 secs no message is sent, connection will be closed to save bandwidth
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    },
});

//Create a connection
io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on('setup', (userData) => {
        console.log(userData.id)
        socket.join(userData.id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat;
        console.log(newMessageReceived);
        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;
            console.log(user._id);
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
