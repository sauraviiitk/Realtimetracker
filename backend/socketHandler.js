const { calculateDistanceAndEta } = require("./controllers/locationcontrollers");

/**
 * roomUsers = {
 *   roomId: {
 *     socketId: { lat, lng }
 *   }
 * }
 */
let roomUsers = {};
let etaIntervalStarted = false;

const startEtaCalculation = (io) => {
  if (etaIntervalStarted) return; 
  etaIntervalStarted = true;

  setInterval(async () => {
    for (const roomId in roomUsers) {
      const users = roomUsers[roomId];
      const ids = Object.keys(users);

      // calculate ETA only if exactly 2 users
      if (ids.length === 2) {
        const [a, b] = ids;
        const u1 = users[a];
        const u2 = users[b];

        if (u1 && u2) {
          try {
            const eta = await calculateDistanceAndEta(u1, u2);
            io.to(roomId).emit("eta:update", eta);
          } catch (err) {
            console.error("ETA calculation failed:", err.message);
          }
        }
      }
    }
  }, 10000);
};

const handleSocketConnection = (socket, io) => {
  console.log(`🟢 user connected: ${socket.id}`);

 
  startEtaCalculation(io);
// room joij 
  socket.on("joinroom", (roomId) => {
    if (!roomId) return;

    socket.join(roomId);
    socket.roomId = roomId;

    if (!roomUsers[roomId]) {
      roomUsers[roomId] = {};
    }

    roomUsers[roomId][socket.id] = null;

    console.log(`👥 ${socket.id} joined room ${roomId}`);
  });
// location update
  socket.on("location:update", ({ lat, lng }) => {
    const roomId = socket.roomId;
    if (!roomId || lat == null || lng == null) return;

    roomUsers[roomId][socket.id] = { lat, lng };

    const updatedUsers = Object.keys(roomUsers[roomId]).map((id) => ({
      userId: id,
      lat: roomUsers[roomId][id]?.lat,
      lng: roomUsers[roomId][id]?.lng,
    }));

    io.to(roomId).emit("location:update", updatedUsers);
  });

  // user disconnect
  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
    const roomId = socket.roomId;

    if (roomId && roomUsers[roomId]) {
      delete roomUsers[roomId][socket.id];

      io.to(roomId).emit(
        "user-offline",
        Object.keys(roomUsers[roomId]).map((id) => ({
          userId: id,
          lat: roomUsers[roomId][id]?.lat,
          lng: roomUsers[roomId][id]?.lng,
        }))
      );

      if (Object.keys(roomUsers[roomId]).length === 0) {
        delete roomUsers[roomId];
        console.log(`🧹 cleaned empty room ${roomId}`);
      }
    }
  });
};

module.exports = { handleSocketConnection };
