import React, { useState } from 'react';
import { useAuth } from '../Firebase/Context/auth-context';
import { getDatabase, ref, set, update, onValue, get } from 'firebase/database';
import { useNavigate } from'react-router-dom';
import { auth } from '../Firebase/firebase';
import './Header.css'; // Make sure to create this CSS file

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const {currentUser, signOut} =useAuth() ;
  const navigate = useNavigate();

  // Dummy data for notifications
  const notifications = [
    { id: 1, message: "New reservation request" },
    { id: 2, message: "Parking space A3 is now available" },
    { id: 3, message: "Monthly report is ready" },
  ];

  const handleSignOut = async () => {
    try {
        const db = getDatabase();
        const uid = auth.currentUser?.uid;
        const dbRef = ref(db, `user/${uid}`);

        await update(dbRef, { active: false });
        await signOut();
        console.log('User signed out');
        navigate('/');
    } catch (error) {
        console.error('Error signing out:', error);
    }
};

  return (
    <header className="dashboard-header">
      <h1>Parking Manager Dashboard</h1>
      <div className="header-controls">
        <div className="notifications">
          <button onClick={() => setShowNotifications(!showNotifications)}>
            🔔 {/* Bell icon */}
            <span className="notification-count">{notifications.length}</span>
          </button>
          {showNotifications && (
            <div className="notification-menu">
              {notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  {notification.message}
                </div>
              ))}
            </div>
          )}

         {currentUser ? ( // Check if user is signed in
          <div className="user-profile">
            <div className="profile-container">
              <button>
                👤 {currentUser.email} {/* Display user email */}
              </button>
              <div className="profile-menu">
                <a href="/profile">View Profile</a>
                <a href="/settings">Settings</a>
                <button onClick={handleSignOut}>Logout</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="sign-in-prompt">
            {/* Optionally add a sign-in button here */}
          </div>
        )}
      </div>
      </div>
    </header>
  );
};

export default Header;