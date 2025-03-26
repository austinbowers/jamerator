import { Stack } from 'expo-router/stack';
import React from "react";
import LogoTitle from "@/components/LogoTitle";
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import {StatusBar} from "expo-status-bar";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';



export default function Layout() {

    const createDbIfNeeded = async (db: SQLiteDatabase) => {
        // Create the chord progressions table
        await db.execAsync(
            `
                CREATE TABLE IF NOT EXISTS ChordProgressions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                genre TEXT,
                difficulty TEXT,
                key TEXT,
                chords TEXT
            );`
        );
    }

  return (
      <>
          <SQLiteProvider databaseName="jamerator.db" onInit={createDbIfNeeded}>
              <ActionSheetProvider>
                  <Stack screenOptions={{  }}>
                      <Stack.Screen name="(tabs)" options={{
                          headerStyle: { backgroundColor: '#0A130E' },
                          headerTitle: props => <LogoTitle {...props} />,
                      }} />
                  </Stack>
              </ActionSheetProvider>
          </SQLiteProvider>
          <StatusBar style="light" />
      </>

  );
}
