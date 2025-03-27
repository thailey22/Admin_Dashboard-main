import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./ReservationManagement.css"; 

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const navagate = useNavigate();

  useEffect(() => {
    const db = getDatabase();
    const reservationsRef = ref(db, "Reservations");

    const unsubscribe = onValue(reservationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
       
        
      
        const formattedReservations = Object.keys(data).map((key) => ({
          id: key,
          ...data[key] 
        }));

        setReservations(formattedReservations);
        console.log(reservations)
      } else {
        setReservations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handelClick = () => {
    navagate('/reservations');
  };

  return (
    <div className="reservation-management">
      <h3>Reservation Management</h3>
      {reservations.length > 0 ? (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Spot</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.User || "N/A"}</td>
                <td>{reservation.Space || "N/A"}</td>
                <td>{reservation.StartTime || "N/A"}</td>
                <td>{reservation.EndTime || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reservations found.</p>
      )}
      <button className="r-button" onClick={() => handelClick()}>View All Reservations</button>
    </div>
  );
};

export default ReservationManagement;
