import  { useState, useEffect } from 'react';
import './App.css';
import { UserContext } from './UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import HomePage from './components/HomePage';
// import HomePage from './components/HomePage';

function App() {
  const [user, setUser] = useState(() =>{
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const updateUser = (newUser) => {
    setUser(newUser);
  };
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);
  return (
    <div className="app">
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main /> } />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path ="/newpost" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}
export default App



