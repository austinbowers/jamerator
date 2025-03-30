import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {useTheme} from "@/scripts/ThemeContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";


const CustomOutlineButton = ({ title, onPress, iconName }) => {
    const [isPressed, setIsPressed] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.button, isPressed ? {borderColor: theme.pressedColor} : {borderColor: theme.primary}]}
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            activeOpacity={1}
        >
            {iconName &&
                <FontAwesome color={theme.primary} name={iconName} size={16}></FontAwesome>
            }
            <Text style={[styles.buttonText, {color: theme.primary}]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '100%',
        borderWidth: 1,
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CustomOutlineButton;