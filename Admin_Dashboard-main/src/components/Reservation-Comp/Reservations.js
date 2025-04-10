import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { useAuth } from '../Firebase/Context/auth-context'; // Assuming you have an auth context for currentUser
import './Reservation.css';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Current authenticated user

  useEffect(() => {
    const db = getDatabase();
    const allResRef = ref(db, 'reservations');
  
    onValue(allResRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("All reservation data:", data);
  
        // Flatten nested structure: reservations/{userId}/{reservationId}
        const reservationsArray = Object.entries(data).flatMap(([userId, userReservations]) =>
          Object.entries(userReservations).map(([resId, resData]) => ({
            id: resId,
            userId,
            ...resData
          }))
        );
  
        setReservations(reservationsArray);
        setLoading(false);
      } else {
        console.log("No reservations found.");
        setReservations([]);
        setLoading(false);
      }
    });
  }, []);
  

  const handleReserveSpot = (carId, reserved) => {
    const db = getDatabase();
    const carRef = ref(db, `users/${currentUser.uid}/cars/${carId}`);

    const newStatus = reserved ? 'empty' : 'reserved'; // Toggle status between 'reserved' and 'empty'

    update(carRef, {
      status: newStatus,
    }).then(() => {
      // Optionally, handle notifications or other actions after reservation is made
      // After updating the status, refresh the list to show the updated data
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === carId ? { ...reservation, reserved: !reserved } : reservation
        )
      );
    });
  };

  return (
    <div className="reservation-container">
      <h3>Reserved Spots</h3>
      <table>
  <thead>
    <tr>
      <th>User ID</th>
      <th>Reservation ID</th>
      <th>Spot</th>
      <th>Date</th>
      <th>Time</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      <tr><td colSpan="5">Loading...</td></tr>
    ) : reservations.length > 0 ? (
      reservations.map((res) => (
        <tr key={res.id}>
          <td>{res.userId}</td>
          <td>{res.id}</td>
          <td>{res.spot}</td>
          <td>{res.date}</td>
          <td>{res.time}</td>
        </tr>
      ))
    ) : (
      <tr><td colSpan="5">No reservations found</td></tr>
    )}
  </tbody>
</table>

    </div>
  );
};

export default ReservationManagement;
