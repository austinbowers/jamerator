import {View, Text, StyleSheet, ScrollView} from "react-native";
import {useLocalSearchParams, Stack, useNavigation} from "expo-router";
import React, {useEffect, useMemo, useState} from "react";
import ChordDiagram from "@/components/ChordDiagram";
import {useTheme} from "@/scripts/ThemeContext";

export default function ProgressionView() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { chords, progressionTitle } = useLocalSearchParams();
    const [arrayChords, setArrayChords] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: progressionTitle,
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: theme.background,
            },
            headerTintColor: theme.primary,
        });
    }, [navigation]);

    useEffect(() => {
        setArrayChords(JSON.parse(chords));
    }, []);

    return (
        <ScrollView style={{backgroundColor: theme.background}}>
            <View>
                {arrayChords && arrayChords.map((data, index) => (
                    <ChordDiagram key={index} chordData={data}></ChordDiagram>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    chordContainer: {
        marginVertical: 32,
        alignItems: 'center',
    },
    chordName: {
        color: '#DFFFEE',
        fontWeight: 'bold',
        marginBottom: 24,
        fontSize: 18,
    },
    fretRow: {
        width: 160, // Adjust width to 80% of the screen width
        height: 40,
        borderBottomWidth: 1,
        borderColor: 'rgba(133,181,156,0.5)',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    firstFret: {
        borderTopWidth: 5,
        borderTopColor: '#85B59C',
    },
    barreChord: {
        position: 'absolute',
        zIndex: 100,
        width: '110%',
        textAlign: 'center',
        alignItems: 'center',
        height: 14,
        left: -8,
        backgroundColor: '#85B59C',
        borderRadius: 12,
        fontWeight: 'bold',
        borderWidth: 3,
        borderColor: '#0A130E',
    },
    barreChordText: {
        position: 'absolute',
        left: 180,
        top: -5,
        color: '#85B59C',
        fontSize: 18,
        fontWeight: 'bold',
    },
    string: {
        width: 1.5,
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#85B59C',
        zIndex: 10,
    },
    lightString: {
        width: 1.5,
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
        // backgroundColor: 'rgba(133,181,155,0.32)',
        backgroundColor: '#85B59C',
        zIndex: 10,
    },
    fingerTextWrapper: {
        flexDirection: 'row',
        height: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },
    fingerText: {
        backgroundColor: '#85B59C',
        color: 'black',
        textAlign: 'center',
        width: 22,
        height: 22,
        fontSize: 18,
        borderRadius: 100,
        fontWeight: 'bold',
    },
    unPlayedStringStyle: {
        color: '#85B59C',
        width: 22,
        height: 22,
        fontSize: 12,
        textAlign: 'center',
        borderRadius: 100,
        top: -25,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    fretNumberStyle: {
        color: '#85B59C',
        width: 22,
        height: 22,
        fontSize: 16,
        textAlign: 'center',
        bottom: -50,
    },
});