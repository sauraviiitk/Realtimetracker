const http=require('http');
const express=require('express');
const app=express();
const {Server}=require('socket.io');
const server=http.createServer(app);
const locationRoutes=require('./routes/locationRoutes');
const { handleSocketConnection } = require('./socketHandler');
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
       // credentials:true,
        methods:["GET","POST"]
    }
})
app.use(express.json());
app.use('/api/location',locationRoutes);
io.on("connection",(socket)=>{
    console.log(`user connected: ${socket.id}`);
    handleSocketConnection(socket,io);
    socket.on("disconnect",()=>{
        console.log(`user disconnected: ${socket.id}`);
    })
})
server.listen(5000,()=>{
    console.log("web socket server is running on port 5000");
})