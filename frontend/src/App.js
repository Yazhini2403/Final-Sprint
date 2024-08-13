import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import SignIn from './components/SignIn';
import SignUp from './components/Signup';
import Task from './components/Task';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthenticated()
      try {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          setIsAuthenticated(true);
        } else {
          const response = await axios.get('/api/auth/check'); // Ensure this endpoint returns a success status if authenticated
          console.log('Auth Check Response:', response);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth Check Failed:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Stop loading after auth check is complete
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while checking authentication
  }

  return (
    <div>
      <Toaster position="top-right" gutter={8} />
      <Routes>
        <Route
          path="/signin"
          element={!isAuthenticated ? <SignIn setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={isAuthenticated ? (
            <AppLayout>
              <div className="flex flex-col items-center w-full pt-10">
                <img src="./image/welcome.svg" className="w-5/12" alt="" />
                <h1 className="text-lg text-gray-600">Select or create new project</h1>
              </div>
            </AppLayout>
          ) : (
            <Navigate to="/signin" />
          )}
        />
        <Route
          path="/:projectId"
          element={isAuthenticated ? (
            <AppLayout>
              <Task />
            </AppLayout>
          ) : (
            <Navigate to="/signin" />
          )}
        />
      </Routes>
    </div>
  );
}

export default App;