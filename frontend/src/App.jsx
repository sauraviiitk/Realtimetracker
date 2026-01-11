import { useEffect, useState } from 'react'
import socket, {
  emitLocationUpdate,
  joinRoom,
  listenForLocationUpdates
} from './socket'
import LiveMap from './components/LiveMap'

const getIdFromUrl = () => {
  const path = window.location.pathname
  const parts = path.split("/room/")
  return parts[1] || null
}

function App() {
  const [users, setUsers] = useState([])
  const [roomID, setRoomID] = useState(getIdFromUrl())

  useEffect(() => {
    console.log("App mounted")

    const roomid = getIdFromUrl()
    if (!roomid) return

    setRoomID(roomid)
    joinRoom(roomid)

    if (!navigator.geolocation) {
      alert("Geolocation not supported")
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        console.log("My location:", lat, lng)
        emitLocationUpdate({ lat, lng })
      },
      (err) => {
        console.error("Location error:", err.message)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    )

    listenForLocationUpdates(setUsers)

    return () => {
      navigator.geolocation.clearWatch(watchId)
      socket.off("location:update")
      socket.off("user-offline")
    }
  }, [])

  return <LiveMap users={users} />
}

export default App
