import { Image } from "react-native";
import React from "react";

const LogoTitle = () => {
    return (
        <Image
            source={require('../assets/images/Jamerator.png')}
            style={{ width: 100, height: 30, paddingBottom: 8, resizeMode: 'contain'}}
        />
    );
}
export default LogoTitle;