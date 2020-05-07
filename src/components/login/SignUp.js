import React, {useCallback} from 'react';
import firebase from '../../firebase';
import { withRouter, Link } from 'react-router-dom';

const SignUp = ({ history }) => {
    const handleSignUp = useCallback(async event => {
        event.preventDefault();
        const { name, email, password } = event.target.elements;
        try {
            firebase.register(name.value, email.value, password.value);
            history.push("/");
        } catch (error) {
            alert(error.message)
        }
    }, [history]);

    return (
        <div>
            <h1>Welcome to this in-development tool, we hope that you enjoy it!</h1>
            <form onSubmit={handleSignUp}>
                <label>
                    Nombre:
                    <input name="name" type="text" placeholder="Nombre de usuario" />
                </label>
                <label>
                    Email:
                    <input name="email" type="email" placeholder="any@example.com" />
                </label>
                <label>
                    Password:
                    <input name="password" type="password" placeholder="Password" />
                </label>
                <button type="submit">Sign Up!</button>
                <button><Link to ="/login/Login">or Log in here</Link></button>
            </form>
        </div>
    );
}

export default withRouter(SignUp);