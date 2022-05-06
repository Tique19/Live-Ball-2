const consume = require("./consumer");
const express = require("express");
const app = express();
const http = require("http");
const { Server } =  require("socket.io");
const cors = require("cors");

app.use(cors());


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});





io.on("connection", (socket) => {
    console.log("user connected");
    consume((message) => {
        console.log(String(message.value))
        socket.emit("score_update", {"game": String(message.value)})
    }).catch(err => {
        console.log(err);
    })
    
});


server.listen(3006, ()=>{
    console.log('Server is running on port 3006');
})