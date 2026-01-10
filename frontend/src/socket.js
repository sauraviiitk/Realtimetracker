import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
export const joinRoom=(roomId)=>{
    socket.emit("joinroom",roomId);
}
export const emitLocationUpdate=(data)=>{
    socket.emit("locationupdate",data);
}
export default socket;
