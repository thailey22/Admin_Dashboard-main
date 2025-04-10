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
  const spotsRef = ref(db, `parkingSpots`);

  useEffect(() => {
    const unsubscribe = onValue(spotsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedSpots = Object.keys(data).map((key) => ({
          id: key,
          status: data[key].status.trim() // Ensure there's no extra space
        }));
  
        // Sort the spots so that 'scheduled' spots come first
        const sortedSpots = formattedSpots.sort((a, b) => {
          // If a spot is scheduled, it should come before empty
          if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
          if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
          return 0; // No change if both are the same
        });
  
        setSpots(sortedSpots);
      } else {
        setSpots([]);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  

  // Function to toggle reservation status
  const toggleReservation = (spotId, currentStatus) => {
    const spotRef = ref(db, `parkingSpots/${spotId}`);
    const newStatus = currentStatus === 'scheduled ' ? 'scheduled ' : 'empty';
    

    // Toggle the IsReserved field
    update(spotRef, {
      status : newStatus,
    }).then(() => {
      // Optionally, refetch data after the update
      const dbRef = ref(db, 'parkingSpots');
      onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedSpots = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          const sortedSpots = formattedSpots.sort((a, b) => {
            const statusA = a.status.trim();
            const statusB = b.status.trim();
            // Move "scheduled" to the top
            if (statusA === 'scheduled' && statusB !== 'scheduled') return -1;
            if (statusA !== 'scheduled' && statusB === 'scheduled') return 1;
            return 0;
          });
          setSpots(sortedSpots);
        
          
        } else {
          setSpots([]);
        }
      });
    });
  };

  return (
    <div className="parking-spaces">
      <h2>Parking Lot</h2>
      <table>
        <thead>
          <tr>
            <th>Spot ID</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {spots.map((spot) => (
            <tr key={spot.id}>
              <td>{spot.id}</td>
              <td>{spot.status.toUpperCase()}</td> {/* Show Free or Reserved */}
              <td>
                <button onClick={() => toggleReservation(spot.id, spot.status)}>
                  {spot.status === 'empty' ? 'Reserve Spot' : 'Cancel Reservation'}
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
