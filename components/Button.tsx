import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {useTheme} from "@/scripts/ThemeContext";


const CustomButton = ({ title, onPress }) => {
    const [isPressed, setIsPressed] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.button, isPressed ? {backgroundColor: theme.pressedColor} : {backgroundColor: theme.primary}]}
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            activeOpacity={1}
        >
            <Text style={[styles.buttonText, {color: theme.buttonText}]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CustomButton;