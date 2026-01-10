const axios=require('axios');
exports.calculateDistanceAndEta=async (source,destination)=>{
const apikey=process.env.ORS_API_KEY;
const url="https://api.openrouteservice.org/v2/matrix/driving-car";
try {
    const  response=await axios.post(url,{
        locations:[
            [source.lng,source.lat],
            [destination.lng,destination.lat]
        ],
        metrics:["distance","duration"],
        units:"km"
    },{
        headers:{
            Authorization:apikey,
            "Content-Type":"application/json"
        }
    })
    const distancekm=response.data.distances[0][1];
    const durationsec=response.data.durations[0][1];
    const durationmin=Math.round(durationsec/60);
    return {
        distance:`${distancekm.toFixed(2)}km`,
        duration:`${durationmin} mins`
    }
} catch (error) {
    console.error("Error calculating distance and ETA:",error);
}
}

exports.getRoute=async(req,res)=>{
    const {source,destination}=req.body;
    const apikey=process.env.ORS_API_KEY;
    const url="https://api.openrouteservice.org/v2/directions/driving-car/geojson";
    try {
       const response=await axios.post(url,{
        coordinates:[
            [source.lng,source.lat],
            [destination.lng,destination.lat]
        ]
       },{
        headers:{
            Authorization:apikey,
            "Content-Type":"application/json"
        }
       }) 
       res.status(200).json(response.data);
    } catch (error) {
       console.error("Error fetching route:",error); 
    }
}