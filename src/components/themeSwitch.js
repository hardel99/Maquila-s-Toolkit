import React from 'react';
import { Fab } from "@material-ui/core";
import { Brightness4Rounded, Brightness5Rounded } from "@material-ui/icons";

export default function ThemeIndicator(isDark) {
    const displayAlt = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    if (isDark) {
        return (
            <Fab size="small" aria-label={displayAlt}>
                here <Brightness4Rounded />
            </Fab>
        );
    } else {
        return (
            <Fab size="small" aria-label={displayAlt}>
                <Brightness5Rounded />
            </Fab>
        );
    }
}