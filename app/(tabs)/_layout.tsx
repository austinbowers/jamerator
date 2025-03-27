import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
            tabBarActiveTintColor: '#85B59C',
            tabBarInactiveTintColor: '#2f483b',
                tabBarStyle: {
                    backgroundColor: '#000000', // Change this to your desired color
                    borderTopColor: '#222f20',
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
