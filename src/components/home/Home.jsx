import React from 'react'
import firebase from '../../firebase/firebase'
import Schedule from '../schedule/Schedule'

const Home = () => {
    return (
        <>
            <h1>Hello {firebase.getCurrentUsername()}!!</h1>
            <button onClick={() => firebase.logout()} >Sign out</button>
            <Schedule />
        </>
    );
}

export default Home;