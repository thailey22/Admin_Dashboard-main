import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Firebase/Context/auth-context';
import Footer from '../View-Comp/Footer';
import ParkingSpaceOverview from '../Parking-Comp/ParkingSpaceOverview';
import ReservationManagement from '../Reservation-Comp/ReservationManagement';
import CameraView from '../Camera-Comp/CameraView';
import ReportsOverview from '../Reports-Comp/ReportsOverview';
import './Dashboard.css'; // Import CSS for styling

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-box"><ParkingSpaceOverview /></div>
        <div className="dashboard-box"><ReservationManagement /></div>
        <div className="dashboard-box"><ReportsOverview /></div>
        <div className="dashboard-box"><CameraView /></div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
