import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from "react";
import {Image} from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
            tabBarActiveTintColor: '#85B59C',
            tabBarInactiveTintColor: '#2f483b',
                tabBarStyle: {
                    backgroundColor: '#0e170c', // Change this to your desired color
                    borderTopColor: '#222f20',
                },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="chords"
                options={{
                    headerShown: false,
                    title: 'Chords',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="music" color={color} />,
                }}
            />
        </Tabs>
    );
}
