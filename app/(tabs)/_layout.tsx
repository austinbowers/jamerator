import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useTheme} from "@/scripts/ThemeContext";

export default function TabLayout() {
    const { theme } = useTheme();

    return (
        <Tabs
            screenOptions={{
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.gray,
                tabBarStyle: {
                    backgroundColor: theme.background, // Change this to your desired color
                    borderTopColor: theme.primary30,
                },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Generate',
                    tabBarIcon: ({ color }) => <FontAwesome size={24} name="music" color={color} />,
                }}
            />
            <Tabs.Screen
                name="chords"
                options={{
                    headerShown: false,
                    title: 'My Jams',
                    tabBarIcon: ({ color }) => <MaterialIcons size={26} name="my-library-music" color={color} />,
                }}
            />
        </Tabs>
    );
}
