import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import './Reservation.css';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spotStatus, setSpotStatus] = useState(null);
  const navagate = useNavigate();


  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, 'parkingSpots'); // Adjust the path to your database structure
  
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const now = Date.now();
  
        const reservationsArray = Object.keys(data).map((key) => {
          const spot = data[key]; // Get the spot data
          
          const startTime = spot.StartTime && spot.StartTime !== 0 ? new Date(spot.StartTime).getTime() : 0;
          const endTime = spot.EndTime && spot.EndTime !== 0 ? new Date(spot.EndTime).getTime() : startTime + 30 * 60 * 1000;
  
          // Check if reservation has expired
          if (now >= endTime && spot.IsReserved) {
            update(ref(db, `Spots/${key}`), { IsReserved: false, StartTime: 0, EndTime: 0 });
          }
  
          return {
            id: key,
            ...spot, // Preserve original values
            reserved: spot.IsReserved, // Use lowercase in JSX
            startTime: startTime === 0 ? "Not Reserved" : formatTime(startTime),
            endTime: startTime === 0 ? "N/A" : formatTime(endTime),
          };
        });
  
        setReservations(reservationsArray);
      } else {
        setReservations([]);
      }
    });
  }, []);
  

  // Function to format timestamp into HH:MM AM/PM
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";

    else if (timestamp === 0) return "Not Reserved";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="reservation-container">
      <h3>Reservation Management</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <tr key={reservation.id} className={reservation.reserved ? "reserved" : "available"}>
                    <td>{reservation.id}</td>
                    <td>{reservation.reserved ? "Reserved" : "Available"}</td>
                    <td>{reservation.startTime}</td>
                    <td>{reservation.endTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No reservations found</td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationManagement;
