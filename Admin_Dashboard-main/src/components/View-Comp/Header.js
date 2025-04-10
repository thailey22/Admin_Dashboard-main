import React, { useState, useEffect } from 'react';
import { useAuth } from '../Firebase/Context/auth-context';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/firebase';
import './Header.css';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Track profile menu state
  const [notifications, setNotifications] = useState([]);
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  

  // Fetch notifications from Firebase
  useEffect(() => {
    if (currentUser) {
      const db = getDatabase();
      const notificationsRef = ref(db, 'notifications'); // Reference for notifications
  
      const unsubscribe = onValue(notificationsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const newNotifications = Object.keys(data).map((key) => ({
            id: key,
            ...data[key] // Getting the actual notification data
          }));
  
          setNotifications(newNotifications); // Update the state to show notifications
        } else {
          setNotifications([]);
        }
      });
  
      return () => unsubscribe();
    }
  }, [currentUser]); // Re-run when the currentUser changes
  

  const handleSignOut = async () => {
    try {
      const db = getDatabase();
      const uid = auth.currentUser?.uid;
      const dbRef = ref(db, `users/${uid}`);

      await update(dbRef, { active: false });
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    navigate('/reports', { state: { reportId: notification.id } });
  };

  return (
    <header className="dashboard-header">
      <h1>Parking Manager Dashboard</h1>
      <div className="header-controls">
        {/* Notifications Button */}
        <div className="notifications">
          <button onClick={() => setShowNotifications(!showNotifications)}>
            🔔 <span className="notification-count">{notifications.length}</span>
          </button>
          {showNotifications && (
            <div className="notification-menu">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="notification-item" 
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.message} {/* Displaying the notification message */}
                  </div>
                ))
              ) : (
                <div className="notification-item">No new notifications</div>
              )}
            </div>
          )}

        </div>

        {/* User Profile Button */}
        {currentUser && (
          <div className="user-profile">
            <div className="profile-container">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
                👤 {currentUser.email}
              </button>
              {showProfileMenu && (
                <div className="profile-menu">
                  <a href="/profile">View Profile</a>
                  <a href="/settings">Settings</a>
                  <button onClick={handleSignOut}>Logout</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
