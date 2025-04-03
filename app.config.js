export default {
    expo: {
        name: 'Jamerator',
        slug: 'jamerator',
        scheme: 'com.austinbowers.jamerator',
        extra: {
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            eas: {
                projectId: "41ff8154-9395-4c0c-b363-66f8193d4b32"
            },
        },
        icon: "./assets/images/Jamerator_Icon.png",
        splash: {
            image: "./assets/icons/splash-icon-dark.png",  // Ensure image is specified here
            resizeMode: "contain",
            backgroundColor: "#0A130E",
            dark: {
                image: "./assets/icons/splash-icon-dark.png",
                backgroundColor: "#0A130E"
            }
        },
        plugins: [
            "expo-sqlite",
            "expo-router",
            [
                "expo-splash-screen",
                {
                    backgroundColor: "#0A130E",
                    image: "./assets/icons/splash-icon-dark.png",
                    dark: {
                        image: "./assets/icons/splash-icon-dark.png",
                        backgroundColor: "#0A130E"
                    },
                    imageWidth: 200
                }
            ]
        ],
        android: {
            "package": "com.austinbowers.jamerator"
        },
        ios: {
            "bundleIdentifier": "com.austinbowers.jamerator",
            "infoPlist": {
                "ITSAppUsesNonExemptEncryption": false
            },
            icon: {
                "dark": "./assets/icons/ios-dark.png",
                "light": "./assets/icons/ios-light.png",
                "tinted": "./assets/icons/ios-tinted.png",
            },
        },
        newArchEnabled: true,
        updates: {
            "url": "https://u.expo.dev/41ff8154-9395-4c0c-b363-66f8193d4b32"
        },
        runtimeVersion: {
            "policy": "appVersion"
        },
        assetBundlePatterns: ["**/*"],
    },
};