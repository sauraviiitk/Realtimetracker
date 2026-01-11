import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

/* ===== JOIN ROOM ===== */
export const joinRoom = (roomId) => {
  socket.emit("joinroom", roomId);
};

/* ===== SEND LOCATION ===== */
export const emitLocationUpdate = (data) => {
  socket.emit("location:update", data); // ✅ FIXED
};

/* ===== RECEIVE LOCATIONS ===== */
export const listenForLocationUpdates = (callback) => {
  socket.on("location:update", callback); // ✅ FIXED
  socket.on("user-offline", callback);
};

export default socket;
