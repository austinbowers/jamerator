import React from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import ChordDisplay from "@/components/ChordDisplay";
import OpenAi from "@/components/OpenAi";

export default function Index() {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: '#0A130E' }}>
            <ChordDisplay/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // Additional styles can be added here
});
