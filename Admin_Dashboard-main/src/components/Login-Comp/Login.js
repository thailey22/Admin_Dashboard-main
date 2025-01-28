import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../Firebase/auth';
import { getDatabase, ref, update } from "firebase/database";
import './Login.css';
import { auth } from '../Firebase/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// 

  const Login = () => {

    const  [email, setEmail] = useState('');
    const  [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSigningIn, setIsSigningIn] = useState('false')

    const navigate = useNavigate();

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
      navigate('/dashboard');

      
      
      try {
        await doSignInWithEmailAndPassword(email, password);
        console.log('user is signed in');
        updateUserData(auth.currentUser);
        navigate('/dashboard');
      } catch (error) {
        console.log('user is not signed in');
        setError(error.message);
        setIsSigningIn(false);
      }
      finally{
        setIsSigningIn(false);
        setError('');
    }
    
    
    };

    const handleGoogleSignIn = async (e) => {
      e.preventDefault();
      const provider = new GoogleAuthProvider();
  
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Update user data on Google Sign-In
        updateUserData(user);
        navigate('/dashboard');
        console.log("Google Sign-In successful");
      } catch (error) {
        console.error("Google Sign-In error:", error.message);
      }
    };


  

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {/* {error && <p className="error">{error}</p>} */}
        <div>
          <label htmlFor="username">Email:</label>
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
        <button type="submit">Log In</button>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        </form>
    </div>
  );
};

export default Login;