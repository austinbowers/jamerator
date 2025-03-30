import { Image } from "react-native";
import React from "react";
import {useTheme} from "@/scripts/ThemeContext";

export default function LogoTitle() {

    const { theme } = useTheme();

    return (
        <Image
            source={theme.status === 'dark' ? require('../assets/images/Jamerator.png') : require('../assets/images/Jamerator_Light.png')}
            style={{ width: 100, height: 30, paddingBottom: 2, resizeMode: 'contain'}}
        />
    );
}