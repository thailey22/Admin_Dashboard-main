import React, { useState, useEffect } from 'react';
import { useAuth } from '../Firebase/Context/auth-context';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import './Users.css';

const Users = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const db = getDatabase();
    const usersRef = ref(db, "user");

    const unsubscribe = onValue(usersRef, (snapshot) => {
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

    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleDelete = (userId) => {
    navigate(`/Delete/${userId}`);
  };

  const handleEdit = (userId) => {
    navigate(`/Edit/${userId}`);
  };

  const handleView = (userId) => {
    navigate(`/View/${userId}`);
  };

  const toggleDropdown = (userId) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  const filteredUsers = users.filter(user =>
    user.id.includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <th>ID</th>
            <th>Email</th>
            <th>License Plate</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.timestamp}</td>
              <td>{user.active ? "Active" : "Inactive"}</td>
              <td className="dropdown-container">
                <button className="three-dot-btn" onClick={() => toggleDropdown(user.id)}>⋮</button>
                {dropdownOpen === user.id && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleView(user.id)}>View</button>
                    <button onClick={() => handleEdit(user.id)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
