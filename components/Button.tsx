import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {useTheme} from "@/scripts/ThemeContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";


const CustomButton = ({ title, onPress, iconName }) => {
    const [isPressed, setIsPressed] = useState(false);
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.button, isPressed ? {backgroundColor: theme.pressedColor} : {backgroundColor: theme.primary}]}
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            activeOpacity={1}
        >
            {iconName &&
            <FontAwesome name={iconName} size={16}></FontAwesome>
            }
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

export default CustomButton;