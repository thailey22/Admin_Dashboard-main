import React, { useState, useEffect } from 'react';
import { useAuth } from '../Firebase/Context/auth-context';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import './Users.css'; // Make sure to create this CSS file

const Users = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Ensure user is authenticated
  const [users, setUsers] = useState([]); // State to store user data

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const db = getDatabase();
    const usersRef = ref(db, "user"); // Adjust the reference based on your database structure

    // Listen for real-time updates
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        console.log("Fetched Data:", usersData); // Debugging log

        const usersArray = Object.keys(usersData).map((key) => ({
          id: key,
          ...usersData[key],
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [currentUser, navigate]);

  return (
    <div className="users-container">
      <h2>Registered Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>License Plate</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.timestamp}</td>
              <td>{user.active? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;

// const Users = () => {
// const navigate = useNavigate();
// const  auth = getAuth();


// useEffect(() => {

//   const db = getDatabase();
//   const usersRef = (db, "user");
// })

//   // Dummy data for users
//   const users = [
//     { id: 1, name: 'John Doe', email: 'john.doe@example.com', licensePlate: 'ABC123' },
//     { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', licensePlate: 'XYZ789' },
//     { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', licensePlate: 'DEF456' },
//     { id: 4, name: 'Emily Brown', email: 'emily.brown@example.com', licensePlate: 'GHI789' },
//     { id: 5, name: 'David Wilson', email: 'david.wilson@example.com', licensePlate: 'JKL012' },
//     { id: 6, name: 'Sarah Davis', email: 'sarah.davis@example.com', licensePlate: 'MNO345' },
//     { id: 7, name: 'Tom Anderson', email: 'tom.anderson@example.com', licensePlate: 'PQR678' },
//     { id: 8, name: 'Lisa Taylor', email: 'lisa.taylor@example.com', licensePlate: 'STU901' },
//   ];

//   return (
//     <div className="users-container">
//       <h2>Registered Users</h2>
//       <table className="users-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>License Plate</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.id}</td>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//               <td>{user.licensePlate}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Users;