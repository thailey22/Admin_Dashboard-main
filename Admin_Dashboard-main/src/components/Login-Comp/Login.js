import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../Firebase/auth';
import { getDatabase, ref, update } from "firebase/database";
import { auth } from '../Firebase/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard'); // Redirect if user is signed in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const updateUserData = (user) => {
    const db = getDatabase();
    const uid = user.uid;
    const userRef = ref(db, `user/${uid}`);

    update(userRef, {
      email: user.email.replaceAll('.', '_'),
      timestamp: Date.now(),
      active: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSigningIn(true);

    try {
      const userCredential = await doSignInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log('User is signed in:', user);

      // updateUserData(user);
      navigate('/dashboard');

    } catch (error) {
      console.error('Sign-in error:', error.code, error.message);
      handleAuthError(error);
      setIsSigningIn(false);
    }
  };

  const handleAuthError = (error) => {
    if (error.code === 'auth/wrong-password') {
      setError('Incorrect password. Please try again.');
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      setError('Invalid email or password.');
      alert('Invalid email or password.');
    } else if (error.code === 'auth/invalid-email') {
      setError('Invalid email format.');
    } else {
      setError('Login failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // updateUserData(user);
      navigate('/dashboard');
      console.log("Google Sign-In successful");
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
    }
  };

  const handlePasswordReset = () => {
    navigate('/ForgotPassword');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSigningIn}>{isSigningIn ? 'Signing In...' : 'Log In'}</button>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        <button className='forgot-password-btn' onClick={handlePasswordReset}>Forgot Password?</button>
      </form>
    </div>
  );
};

export default Login;
