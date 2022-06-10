const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler} = require('./middleware/errorMiddleware')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 5000
dotenv.config()
connectDB()

app.use(express.json())         // to accept JSON Data
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("API is running!")
})

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound)
app.use(errorHandler)

const server = app.listen(port, console.log(`Server started on port ${port}`))

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log('connected to socket.io')

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log("User joined Room: " + room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat

        if (!chat.users) return console.log("chat.users not defined")

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return

            socket.in(user._id).emit("message received", newMessageRecieved)
        });
    })

    socket.off('setup', () => {
        console.log('USER DISCONNECTED')
        socket.leave(userData._id)
    })
})