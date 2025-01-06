import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/login';
import HomePage from './Components/home';

function App(){
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path="/" element={<LoginForm />} />
                    <Route path="/home" element={<HomePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
