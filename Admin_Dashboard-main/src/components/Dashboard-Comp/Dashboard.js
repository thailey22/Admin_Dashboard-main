// src/components/Dashboard.js
import React, {useEffect} from 'react';
import { useNavigate } from'react-router-dom';
import { useAuth } from '../Firebase/Context/auth-context';
import Footer from '../View-Comp/Footer';
import ParkingSpaceOverview from '../Parking-Comp/ParkingSpaceOverview';
import ReservationManagement from '../Reservation-Comp/ReservationManagement';
import CameraView from '../Camera-Comp/CameraView';

const Dashboard = () => {

  const { currentUser } = useAuth(); // Get current user from context
  const navigate = useNavigate();

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <main>
          <ParkingSpaceOverview />
          <ReservationManagement />
          <CameraView />
          {/* Add more components as needed */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;