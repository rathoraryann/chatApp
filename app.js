const express = require("express")
const cors = require("cors")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const conn = require("./conn/conn")
const app = express()
const path = require("path")
app.use(express.json())


app.use(cors())
conn();

// app.get('/', (req, res) => {
//     res.send("hello")
// })

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)

// app.get('/', (req, res)=>{
//     app.use(express.static(path.resolve(__dirname, "frontend", "dist")));
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// })


// const __dirname1 = path.resolve();
// app.use(express.static(path.join(__dirname1, "/frontend/dist")));
// app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
// );


// Serve the frontend's static files (adjust the path for Vite or CRA builds)
app.use(express.static(path.join(__dirname, 'frontend/dist'))); // Vite output folder

// Example API route
app.get('/api/test', (req, res) => {
  res.send({ message: "API working" });
});

// Catch-all for frontend routing (React/Vite)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});



const server = app.listen(3000)

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (recievedNewMessage) => {
        var chat = recievedNewMessage.chat;

        if (!chat.users) return console.log("chat.user not defined");

        chat.users.forEach((user) => {
            if (user._id == recievedNewMessage.sender._id) return;

            socket.in(user).emit("msgRecieved", recievedNewMessage)

        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})