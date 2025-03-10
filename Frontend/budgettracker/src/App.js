import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterForm from './Components/register';
import LoginForm from './Components/login';
import BudgetTrackerHome from './Components/home';
import Dashboard from './Components/Dashboard';

const App = () => {
    const username = "testuser"; // Replace with the actual username after login

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/register" />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<BudgetTrackerHome username={username} />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
