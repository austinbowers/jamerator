import { Stack } from 'expo-router/stack';
import React from "react";
import LogoTitle from "@/components/LogoTitle";

export default function Layout() {
  return (
      <Stack screenOptions={{  }}>
        <Stack.Screen name="(tabs)" options={{
            headerStyle: { backgroundColor: '#0A130E' },
            headerTitle: props => <LogoTitle {...props} />,
        }} />
      </Stack>
  );
}
