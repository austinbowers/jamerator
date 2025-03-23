export default {
    expo: {
        name: 'Jamerator',
        slug: 'jamerator',
        scheme: 'com.austinbowers.jamerator',
        extra: {
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        },
        "plugins": [
            [
                "expo-sqlite",
                "expo-router",
            ]
        ],
        "android": {
            "package": "com.austinbowers.jamerator"
        },
        "ios": {
            "bundleIdentifier": "com.austinbowers.jamerator"
        },
        "newArchEnabled": true,
    },
};