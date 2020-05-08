import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './home/Home';
import Login from './login/Login';
import SignUp from './login/SignUp';
import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';


const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <PrivateRoute exact path='/' component={Home} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/signup' component={SignUp} />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;