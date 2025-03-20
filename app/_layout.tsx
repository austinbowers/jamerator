import { Stack } from 'expo-router/stack';
import React from "react";
import LogoTitle from "@/components/LogoTitle";

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
