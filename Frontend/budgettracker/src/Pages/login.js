import React , {useState} from 'react';
import {useHistory} from "react-dom-render";
import '.\Styling\LoginForm.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();

        //Simulate login logic 

        if(username === 'testuser' && password === 'password123'){
            history.push('./home.js');
        }
        else{
            alert('Enter valid username and password');
        }
    };

    return (
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Username:</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      );
};

export default LoginForm;
