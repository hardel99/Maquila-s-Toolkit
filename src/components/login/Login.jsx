import React, { useContext, useCallback } from 'react';
import firebase from '../../firebase/firebase';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { AuthContext } from '../../firebase/Auth';

const Login = ({ history }) => {
    const handleLogin = useCallback(async event => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            await firebase.login( email.value, password.value);
            history.push("/");
        } catch (error) {
            alert(error.message);
        }
    }, [history]);

    const { currentUser } = useContext(AuthContext);

    //?Comentar este if a la hora de diseñar el login
    if (currentUser) {
        return <Redirect to='/' />
    }

    return (
        <div>
            <h1>Log in</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Email:
                    <input name="email" type="email" placeholder="any@example.com" />
                </label>
                <label>
                    Password:
                    <input name="password" type="password" placeholder="Password" />
                </label>
                <button type="submit">Log in!</button>
                <button><Link to="/signup">or Sign Up here!</Link></button>
            </form>
        </div>
    );
}


/**
 * !TO-DO:
 *  ?Log-in with Google account
 *  ?Forget password?
 *  ?Remember me
 * 
 * !Errors:
 *  *Sometimes don't log-in because yes
 */

export default withRouter(Login);