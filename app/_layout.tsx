import { Stack } from 'expo-router/stack';
import React from "react";
import LogoTitle from "@/components/LogoTitle";
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import {StatusBar} from "expo-status-bar";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';



export default function Layout() {

  return (
      <>
          <SQLiteProvider databaseName="chords.db" assetSource={{ assetId: require('../assets/chords.db') }}>
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
