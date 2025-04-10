import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../Firebase/firebase';
import './ViewUserS.css';

const ViewUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userCars, setUserCars] = useState([]);

  useEffect(() => {
    const userRef = ref(database, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserData(data);
        if (data.cars) {
          setUserCars(Object.values(data.cars));
        }
      } else {
        setUserData(null);
      }
    });

    return () => off(userRef);
  }, [userId]);

  if (!userData) {
    return <div className="view-container">User not found.</div>;
  }

  return (
    <div className="view-container">
      <h2>User Details</h2>
      <div className="user-info">
        <p><strong>Name:</strong> {userData.displayName || userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
        <p><strong>Created At:</strong> {userData.createdAt ? new Date(userData.createdAt).toLocaleString() : 'N/A'}</p>
        {userData.profileImage || userData.photoURL ? (
          <div className="profile-img">
            <img
              src={userData.profileImage || userData.photoURL}
              alt="Profile"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        ) : null}
      </div>

      <div className="cars-section">
        <h3>Registered Cars</h3>
        {userCars.length > 0 ? (
          <ul>
            {userCars.map((car, index) => (
              <li key={index}>
                {car.make || car.name} {car.model || ''} - {car.color || ''} ({car.license || 'No license'})
              </li>
            ))}
          </ul>
        ) : (
          <p>No cars registered.</p>
        )}
      </div>

      <button onClick={() => navigate(-1)} className="back-btn">Back</button>
    </div>
  );
};

export default ViewUser;
