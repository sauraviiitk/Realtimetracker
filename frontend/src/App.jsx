import { useEffect, useState } from 'react'
import socket, { joinRoom } from './socket';
import LiveMap from './components/LiveMap';

const getIdFromUrl=()=>{
  const path=window.location.pathname;
  const parts=path.split("/room/");
  return parts[1]||null;
}
function App() {
 const[roomID,setroomID]=useState(getIdFromUrl());
useEffect(()=>{
  const roomid=getIdFromUrl();
  if(!roomid)return ;
  setroomID(roomid);
 joinRoom(roomID);
if(!navigator.geolocation()){
  alert("Geolocation not supported")
  return ;
}
navigator.geolocation.getCurrentPosition(handleLocation,handleError,{
  enableHighAccuracy:true,
  maximumAge:0,
  timeout:5000
})
},[])

  return (
    <>
   <LiveMap/>
    </>
  )
}

export default App
