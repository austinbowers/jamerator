import { Stack } from 'expo-router/stack';
import { Image } from 'react-native';
import React from "react";

function LogoTitle() {
    return (
        <Image
            source={require('../assets/images/Jamerator.png')}
            style={{ width: 100, height: 30, paddingBottom: 8, resizeMode: 'contain'}}
        />
    );
}

export default function Layout() {
  return (
      <Stack screenOptions={{  }}>
        <Stack.Screen name="(tabs)" options={{
            headerStyle: { backgroundColor: '#0e170c' },
            headerTitle: props => <LogoTitle {...props} />,
        }} />
      </Stack>
  );
}
