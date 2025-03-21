import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, remove, get, set, push } from "firebase/database";
import { useAuth } from "../Firebase/Context/auth-context";
import './deleteStyle.css';
const Delete = () => {
  const { userId } = useParams();
  const db = getDatabase();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userEmail, setUserEmail] = useState("");
  const [deleteReason, setDeleteReason] = useState(""); // State for input

  useEffect(() => {
    const fetchEmail = async () => {
      const emailRef = ref(db, `user/${userId}/email`);
      try {
        const snapshot = await get(emailRef);
        if (snapshot.exists()) {
          setUserEmail(snapshot.val());
        } else {
          setUserEmail("Unknown User");
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };

    fetchEmail();
  }, [db, userId]);

  if (!currentUser) {
    navigate("/");
    return null;
  }

  const confirmDelete = async () => {
    if (!deleteReason.trim()) {
      alert("Please provide a reason for deletion.");
      return;
    }

    const userRef = ref(db, `user/${userId}`);
    const deleteReasonsRef = ref(db, `delete_reasons`);

    try {
      // Save delete reason
      await push(deleteReasonsRef, {
        userId,
        email: userEmail,
        reason: deleteReason,
        deleted_At: new Date().toISOString(),
      });

      // Delete user
      await remove(userRef);
      console.log(`User ${userId} deleted successfully.`);
      navigate("/users");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="delete-container">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete user {userEmail}?</p>
      <textarea
        placeholder="Enter reason for deletion..."
        value={deleteReason}
        onChange={(e) => setDeleteReason(e.target.value)}
        className="delete-reason-input"
      />
      <button onClick={confirmDelete} className="confirm-btn">Yes, Delete</button>
      <button onClick={() => navigate("/users")} className="cancel-btn">Cancel</button>
    </div>
  );
};

export default Delete;
