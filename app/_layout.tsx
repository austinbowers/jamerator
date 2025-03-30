import { Stack } from 'expo-router/stack';
import React, {useEffect} from "react";
import LogoTitle from "@/components/LogoTitle";
import {SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from "expo-status-bar";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import {ThemeProvider, useTheme } from '@/scripts/ThemeContext'
import {View} from "react-native";


export default function Layout() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

function AppContent() {
    const { theme } = useTheme();

    return (
        <>
            <SQLiteProvider
                databaseName="chords.db"
                assetSource={{ assetId: require("../assets/chords.db") }}
            >
                <ActionSheetProvider>
                    <View style={{ flex: 1, backgroundColor: theme.background }}>
                        <Stack>
                            <Stack.Screen
                                name="(tabs)"
                                options={{
                                    headerStyle: { backgroundColor: theme.background },
                                    headerTintColor: theme.text,
                                    headerShown: true,
                                    headerTitle: props => <LogoTitle {...props}/>,
                                }}
                            />
                        </Stack>
                    </View>
                </ActionSheetProvider>
            </SQLiteProvider>
            <StatusBar style={theme.status === 'dark' ? 'light' : 'dark'} />
        </>
    );
}