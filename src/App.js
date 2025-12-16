import React, { useState } from 'react';
import AuthUI from './components/AuthUI/AuthUI';
import MainChatDashboard from './components/MainChatDashboard/MainChatDashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <MainChatDashboard onLogout={handleLogout} />
      ) : (
        <AuthUI onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}