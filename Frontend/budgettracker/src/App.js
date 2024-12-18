import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LoginForm from './LoginForm';
import HomePage from './HomePage';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route exact path ="/" component={LoginForm} />
                    <Route path="/home" component={HomePage} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;