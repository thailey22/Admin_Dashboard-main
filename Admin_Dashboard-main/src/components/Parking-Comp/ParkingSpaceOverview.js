import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from "firebase/database";
import "./ParkingSpaceOverview.css"; 

const ParkingSpaceOverview = () => {
  const [totalSpaces, setTotalSpaces] = useState(0);
  const [reservedSpaces, setReservedSpaces] = useState(0); 
  const navagate = useNavigate();

  useEffect(() => {
    const db = getDatabase();
    const spotsRef = ref(db, "parkingSpots"); // Adjust the path to your database structure

    const unsubscribe = onValue(spotsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const total = Object.keys(data).length;
        const reserved = Object.values(data).filter((spot) => spot.IsReserved === 0).length;
        setTotalSpaces(total);
        setReservedSpaces(reserved);
      } else {
        setTotalSpaces(0);
        setReservedSpaces(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const availableSpaces = totalSpaces - reservedSpaces; // Available is total - reserved
  const occupancyRate = totalSpaces > 0 ? (reservedSpaces / totalSpaces) * 100 : 0;
  const handelClick = () => {

    navagate('/parking-spaces');


  };

  return (
    <div className="parking-space-overview">
      <h3>Parking Space Overview</h3>
      <div className="stats">
        <p><strong>Total Spaces:</strong> {totalSpaces}</p>
        <p><strong>Reserved Spaces:</strong> {reservedSpaces}</p>
        <p><strong>Available Spaces:</strong> {availableSpaces}</p>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${occupancyRate}%` }}></div>
      </div>
      <p className="occupancy-text">{Math.round(occupancyRate)}% Occupied</p>
      <button onClick={() => handelClick()}>
        View Parking Spaces
      </button>
    </div>
  );
};

export default ParkingSpaceOverview;
