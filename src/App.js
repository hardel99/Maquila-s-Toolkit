import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home, Login, SignUp } from './components'
import { AuthProvider } from './firebase/Auth';
import PrivateRoute from './firebase/PrivateRoute';


// import './App.module.css'

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