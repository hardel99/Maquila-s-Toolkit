import React, { useState } from 'react'
import firebase from '../../firebase/firebase'
import Schedule from '../schedule/Schedule'
import { ThemeProvider, createMuiTheme, Switch, Button } from '@material-ui/core'

import './Home.module.css'

const Home = () => {
    const [darkState, setDarkState] = useState(false)
    const paletteType = darkState ? "dark" : "light";

    const darktheme = createMuiTheme({
        palette: {
            type: paletteType,
        }
    });

    const handleThemeChange = () => {
        setDarkState(!darkState);
    };

    return (
        <>
            <ThemeProvider theme={darktheme}>
                <h1>Hello {firebase.getCurrentUsername()}!!</h1>
                <Button color="secondary" variant="contained" onClick={() => firebase.logout()} >Sign out</Button>
                <Switch checked={darkState} onChange={handleThemeChange} />
                <Schedule />
            </ThemeProvider>
        </>
    );
}

export default Home;