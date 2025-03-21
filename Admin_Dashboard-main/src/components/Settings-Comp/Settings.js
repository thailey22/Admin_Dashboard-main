import React, { useState } from 'react';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useNavigate } from'react-router-dom';
import './Settings.css';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState('');

  const auth = getAuth();
  const Navigate = useNavigate();
  const user = auth.currentUser;

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('You need to be logged in to change your password.');
      Navigate('/');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if(newPassword === currentPassword){
      setMessage('New password cannot be the same as your current password.');
      return;
    }

    try {
      // Reauthenticate the user first
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      
      await updatePassword(user, newPassword);
      
      setMessage('Password updated successfully.');
      
      // Optionally, sign the user out to make them log in with the new password
      auth.signOut();
      Navigate('/');
    } catch (error) {
      setMessage(error.message);
    }

    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setShowPasswordForm(false);
  };

  return (
    <div className={`settings-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Settings</h2>

      <div className="setting-item">
        <h3>Dark Mode</h3>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
          <span className="slider round"></span>
        </label>
      </div>

      <div className="setting-item">
        <h3>Change Password</h3>
        <button onClick={() => setShowPasswordForm(!showPasswordForm)}>
          {showPasswordForm ? 'Cancel' : 'Change Password'}
        </button>
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="password-form">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        )}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Settings;
