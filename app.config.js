export default {
    expo: {
        name: 'Jamerator',
        slug: 'jamerator',
        scheme: 'com.austinbowers.jamerator',
        extra: {
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            "eas": {
                "projectId": "41ff8154-9395-4c0c-b363-66f8193d4b32"
            },
        },
        "icon": "./assets/images/Jamerator_Icon.png",
        "plugins": [
            [
                "expo-sqlite",
                "expo-router",
                "expo-splash-screen",
                {
                    image: "./assets/icons/splash-icon-dark.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                    dark: {
                        image: "./assets/icons/splash-icon-light.png",
                        backgroundColor: "#000000",
                    }
                }
            ]
        ],
        "android": {
            "package": "com.austinbowers.jamerator",
            "adaptiveIcon": {
                foregroundImage: "./assets/icons/adaptive-icon.png",
                monochromeImage: "./assets/icons/adaptive-icon.png",
                backgroundColor: "#ffffff",
            }
        },
        "ios": {
            "bundleIdentifier": "com.austinbowers.jamerator",
            "infoPlist": {
                "ITSAppUsesNonExemptEncryption": false
            },
            "icon": {
                dark: "./assets/icons/ios-dark.png",
                light: "./assets/icons/ios-light.png",
                tinted: "./assets/icons/ios-tinted.png",
            }
        },
        "newArchEnabled": true,
        "updates": {
            "url": "https://u.expo.dev/41ff8154-9395-4c0c-b363-66f8193d4b32"
        },
        "runtimeVersion": {
            "policy": "appVersion"
        },
    },
};