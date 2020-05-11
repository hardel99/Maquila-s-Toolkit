import React from 'react'
import firebase from '../../firebase/firebase'

const Home = () => {
    return (
        <>
            <h1>Hello {firebase.getCurrentUsername()}!!</h1>
            <button onClick={() => firebase.logout()} >Sign out</button>
        </>
    );
}

export default Home;