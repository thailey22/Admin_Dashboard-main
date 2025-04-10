import React, { useState, useEffect } from 'react';
import { useAuth } from '../Firebase/Context/auth-context';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import './Users.css';
import { database } from '../Firebase/firebase';

const Users = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [userCars, setUserCars] = useState({});

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.keys(usersData).map((key) => ({
          id: key,
          ...usersData[key],
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    });

    return () => { off(usersRef); };
  }, [currentUser, navigate]);

  const toggleDropdown = (userId) => {
    if (dropdownOpen === userId) {
      setDropdownOpen(null);
      return;
    }

    setDropdownOpen(userId);

    // Load cars if not already loaded
    if (!userCars[userId]) {
      const carsRef = ref(database, `users/${userId}/cars`);
      onValue(carsRef, (snapshot) => {
        if (snapshot.exists()) {
          setUserCars((prev) => ({
            ...prev,
            [userId]: Object.values(snapshot.val()),
          }));
        } else {
          setUserCars((prev) => ({
            ...prev,
            [userId]: [],
          }));
        }
      }, {
        onlyOnce: true
      });
    }
  };

  const handleDelete = (userId) => {
    navigate(`/Delete/${userId}`);
  };

  const handleEdit = (userId) => {
    navigate(`/Edit/${userId}`);
  };

  const handleView = (userId) => {
    navigate(`/ViewUser/${userId}`);
  };

  const filteredUsers = users.filter(user =>
    user.id.includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-container">
      <h2>Registered Users</h2>
      <input
        type="text"
        placeholder="Search by ID, or Email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <React.Fragment key={user.id}>
              <tr>
                <td>{user.displayName || user.firstName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.createdAt}</td>
                
                <td className="action-buttons">
                <button className="btn view-btn" onClick={() => handleView(user.id)}>View</button>
                <button className="btn edit-btn" onClick={() => handleEdit(user.id)}>Edit</button>
                <button className="btn delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                <button className="btn cars-btn" onClick={() => toggleDropdown(user.id)}>
                  {dropdownOpen === user.id ? 'Hide Cars' : 'Show Cars'}
                </button>
              </td>


              </tr>
              {dropdownOpen === user.id && userCars[user.id] && (
                <tr>
                  <td colSpan="5">
                    <div className="cars-dropdown">
                      {userCars[user.id].length > 0 ? (
                        <ul>
                          {userCars[user.id].map((car, index) => (
                            <li key={index}>
                              {car.make} {car.model} - {car.color} ({car.license})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No cars found for this user.</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
