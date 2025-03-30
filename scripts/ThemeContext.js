import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

const lightTheme = {
    status: 'light',
    background: '#fff',
    text: '#000',
    buttonText: '#fff',
    primary: '#638875',
    primary30: '#b1beb9',
    gray: '#969696',
    pressedColor: '#85B59C',
    // ... other styles
};

const darkTheme = {
    status: 'dark',
    background: '#0D1210',
    text: '#fff',
    buttonText: '#000',
    primary50:'#F3F8F5',
    primary100:'#E7F0EB',
    primary200:'#CEE1D7',
    primary300:'#B6D3C4',
    primary400:'#9DC4B0',
    primary: '#85B59C',
    primary600: '#6A917D',
    primary700: '#506D5E',
    primary800: '#35483E',
    primary900: '#1B241F',
    primary925: '#0D1210',
    primary950: '#070908',
    primary30: '#27332e',
    gray: '#969696',
    pressedColor: '#1e2d26',

    // ... other styles
};

const ThemeProvider = ({ children }) => {
    // TODO: Option for Theme change.
    // const [theme, setTheme] = useState(Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme);
    const [theme, setTheme] = useState(darkTheme);

    const toggleTheme = () => {
        setTheme(theme === lightTheme ? darkTheme : lightTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const useTheme = () => {
    return useContext(ThemeContext);
};

export { ThemeProvider, useTheme };