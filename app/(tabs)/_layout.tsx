import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from "react";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
            tabBarActiveTintColor: '#85B59C',
            tabBarInactiveTintColor: '#2f483b',
                tabBarStyle: {
                    backgroundColor: '#0A130E', // Change this to your desired color
                    borderTopColor: '#222f20',
                },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Generator',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="flask" color={color} />,
                }}
            />
            <Tabs.Screen
                name="chords"
                options={{
                    headerShown: false,
                    title: 'Library',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="music" color={color} />,
                }}
            />
        </Tabs>
    );
}
