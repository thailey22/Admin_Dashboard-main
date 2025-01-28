// src/App.js
import React, { useContext, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import './App.css';
import Header from './components/View-Comp/Header';
import Sidebar from './components/View-Comp/Sidebar';
import Dashboard from './components/Dashboard-Comp/Dashboard';
import ParkingSpaces from './components/Parking-Comp/ParkingSpaces';
import Reservations from './components/Reservation-Comp/Reservations';
import Users from './components/User-Comp/Users';
import Reports from './components/Reports-Comp/Reports';
import Settings from './components/Settings-Comp/Settings';
import Login from './components/Login-Comp/Login.js'; // Import the Login component
import { AuthProvider, useAuth } from './components/Firebase/Context/auth-context';
import Footer from './components/View-Comp/Footer.js';
//import { AuthProvider, authcon } from './context/auth-context.js';

function AppContent(){
  const routesArray =[
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/parking-spaces',
      element: <ParkingSpaces />,
    },
    {
      path: '/reservations',
      element: <Reservations />,
    },
    {
      path: '/users',
      element: <Users />,
    },
    {
      path: '/reports',
      element: <Reports />,
    },
    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/',
      element: <Login />,
    },
    {

    }

  ];


  let routeElement = useRoutes(routesArray);

  const {userLogIn}  = useAuth();

  return(
    <div className="app-container">
      {userLogIn && <Header />}
      <div className="main-layout">
       {userLogIn && <Sidebar />}
        <div className="content-container">{routeElement}</div>
      </div>
      <Footer />
    </div>
  )
}


  function App() {
    return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    );
}

export default App;