// LiveMap.jsx
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import "leaflet/dist/leaflet.js"
const position = [22.505, 88.09]
export default function LiveMap() {
  return(
    <MapContainer center={position} zoom={17} scrollWheelZoom={false} style={{height:'100vh',width:"100vw"}}>
    <TileLayer
      attribution='urbanMove'
       url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    />
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
  )

}
