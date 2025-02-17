import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Firebase/Context/auth-context'; // Import auth context
import { Database, getDatabase, ref, onValue } from 'firebase/database';
import './ParkingSpaces.css';

const ParkingSpaces = () => {
  const { currentUser } = useAuth(); // Get current user from context
  const navigate = useNavigate();
  const [number, setNumber] = useState(null); // State to store the number

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const db = getDatabase();
    const dbRef = ref(db, "Number");

    // Fetch data in real-time
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setNumber(snapshot.val());
      } else {
        setNumber("No data available");
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [currentUser, navigate]);

  return (
    <div className="parking-spaces">
      <h2>Parking Lot</h2>
      <p>Current Number from Database: {number !== null ? number : "Loading..."}</p>
    </div>
  );
};

export default ParkingSpaces;

// const ParkingSpaces = () => {
//   const { currentUser } = useAuth(); // Get current user from context
//   const navigate = useNavigate();
 

//   // Redirect to login if the user is not authenticated
//   useEffect(() => {
//     const db = getDatabase();
//     const dbRef = ref(db,"Number");


//     if (!currentUser) {
//       navigate('/');
//     }
//   }, [currentUser, navigate]);
//   const parkingLot = [
//     ['A1', 'A2', 'A3', 'A4', 'A5'],
//     ['B1', 'B2', 'B3', 'B4', 'B5'],
//     ['C1', 'C2', 'C3', 'C4', 'C5'],
//     ['D1', 'D2', 'D3', 'D4', 'D5'],
//   ];

//   // Dummy data for occupied spaces (you would fetch this from your backend)
//   const occupiedSpaces = ['A2', 'B4', 'C1', 'D3'];

//   return (
//     <div className="parking-spaces">
//       <h2>Parking Lot</h2>
//       <div className="parking-lot">
//         {parkingLot.map((row, rowIndex) => (
//           <div key={rowIndex} className="parking-row">
//             {row.map((space) => (
//               <div
//                 key={space}
//                 className={`parking-space ${occupiedSpaces.includes(space) ? 'occupied' : 'available'}`}
//               >
//                 <div className="space-number">{space}</div>
//                 <div className="car-icon">{occupiedSpaces.includes(space) ? '🚗' : ''}</div>
//               </div>
//             ))}
//           </div>
//         ))}
//         <div className="road"></div>
//       </div>
//       <div className="legend">
//         <div className="legend-item">
//           <div className="legend-color available"></div>
//           <span>Available</span>
//         </div>
//         <div className="legend-item">
//           <div className="legend-color occupied"></div>
//           <span>Occupied</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ParkingSpaces;