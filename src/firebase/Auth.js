import React, { useEffect, useState } from 'react'
import firebase from './firebase'

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        firebase.auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setPending(false);
        });
    }, []);

    //If the user has already logged-in in our app
    if (pending) {
        //Add a loading screen between login and home-page
        return <>Loading...</>
    }

    return (
        <AuthContext.Provider
            value={{currentUser}}
        >
            {children}
        </AuthContext.Provider>
    );
};