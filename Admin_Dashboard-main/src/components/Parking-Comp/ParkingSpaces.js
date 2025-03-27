import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Firebase/Context/auth-context'; // Import auth context
import { getDatabase, ref, onValue, update } from 'firebase/database'; // Import update method
import './ParkingSpaces.css';

const ParkingSpaces = () => {
  const { currentUser } = useAuth(); // Get current user from context
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]); // State to store parking spots data
  const db = getDatabase();
  const spotsRef = ref(db, `Spots`);

  useEffect(() => {
    const unsubscribe = onValue(spotsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedSpots = Object.keys(data).map((key) => ({
          id: key,
          StartTime: data[key].StartTime,
          EndTime: data[key].EndTime,
          IsReserved: data[key].IsReserved === 0 ? 0 : false, // Normalize values
        }));
        setSpots(formattedSpots);
      } else {
        setSpots([]);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  // Function to toggle reservation status
  const toggleReservation = (spotId, currentStatus) => {
    const spotRef = ref(db, `Spots/${spotId}`);
    const newStatus = currentStatus === 0 ? false : 0; // Explicit toggle
    update(spotRef, { IsReserved: newStatus });
  };

  return (
    <div className="parking-spaces">
      <h2>Parking Lot</h2>
      <table>
        <thead>
          <tr>
            <th>Spot ID</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Is Reserved</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {spots.map((spot) => (
            <tr key={spot.id}>
              <td>{spot.id}</td>
              <td>{spot.StartTime}</td>
              <td>{spot.EndTime}</td>
              <td>{spot.IsReserved === false ? 'Free' : 'Reserved'}</td>
              <td>
                <button onClick={() => toggleReservation(spot.id, spot.IsReserved)}>
                  {spot.IsReserved === false || spot.IsReserved === 0 ? 'Reserve Spot' : 'Cancel Reservation'}
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParkingSpaces;
