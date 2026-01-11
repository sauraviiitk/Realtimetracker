import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

export default function LiveMap({ users }) {
  if (!users || users.length === 0) return null

  const center = [users[0].lat, users[0].lng]

  return (
    <MapContainer
      center={center}
      zoom={17}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        attribution="urbanMove"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {/* MARKERS */}
      {users.map((user) => (
        <Marker
          key={user.userId}
          position={[user.lat, user.lng]}
        />
      ))}

      {/* LINE BETWEEN TWO USERS */}
      {users.length === 2 && (
        <Polyline
          positions={[
            [users[0].lat, users[0].lng],
            [users[1].lat, users[1].lng]
          ]}
        />
      )}
    </MapContainer>
  )
}
