const { calculateDistanceAndEta } = require("./controllers/locationcontrollers");
let roomUsers={};
const handleSocketConnection=(socket,io)=>{
    console.log(`user connected: ${socket.id}`);
    socket.on("joinroom",(roomId)=>{
        socket.join(roomId);
        socket.roomId=roomId;
        if(!roomUsers[roomId]){
            roomUsers[roomId]={};
        }
        roomUsers[roomId][socket.id]={};
    })
    socket.on("locationupdate",async (data)=>{
        const {lat,lng}=data;
        const roomId=socket.roomId;
        if(!roomId)return ;
        roomUsers[roomId][socket.id]={lat,lng};
        const users=roomUsers[roomId];
        const updatedUsers=await Promise.all(Object.keys(users).map(async(id)=>{
            let distance=null;
            let duration=null;
            if(users[id]&&users[socket.id]){
                try {
                    if(id!==socket.id){
                        const result = await calculateDistanceAndEta(users[socket.id],users[id]);
                        distance=result.distance;
                        duration=result.duration;
                    }
                } catch (error) {
                    console.error("Error in distance and ETA calculation:",error);
                }
            }
            return {
                userID:id,
                lat:users[id].lat,
                lng:users[id].lng,
                distance,
                eta:duration
            }
        }))
        io.to(roomId).emit("userupdatedlocation",updatedUsers);
    })
    socket.on("disconnect",()=>{
        console.log(`user disconnected: ${socket.id}`);
        const roomId=socket.roomId;
        if(roomId&&roomUsers[roomId]){
            delete roomUsers[roomId][socket.id];
            io.to(roomId).emit("userupdatedlocation",Object.keys(roomUsers[roomId]).map(id=>({
                userID:id,
                lat:roomUsers[roomId][id].lat,
                lng:roomUsers[roomId][id].lng
            })));
        }
    })
}
module.exports={handleSocketConnection};