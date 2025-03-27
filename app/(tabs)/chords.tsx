import {View, Text, SafeAreaView, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import React, {useCallback, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";
import {useFocusEffect, Link} from "expo-router";
import ChordDiagram from "@/components/ChordDiagram";
import FontAwesome from "@expo/vector-icons/FontAwesome";


export default function Chords() {

    const database = useSQLiteContext();
    const [chordProgressions, setChordProgressions] = useState<any>([]);
    const [chordsLoading, setChordsLoading] = useState(false);

    const loadData = async () => {
        setChordsLoading(true);

        // Step 1: Fetch the jams from the my_jams table
        const result = await database.getAllAsync<{
            id: number;
            chord_ids: string;
        }>("SELECT * FROM my_jams ORDER BY id DESC");

        // Step 2: Loop through each row in my_jams and fetch the chords based on chord_ids
        const jamsWithChords = await Promise.all(result.map(async (jam) => {
            const chordIds = jam.chord_ids.split(',').map(id => parseInt(id)); // Split and convert to integer array

            // Step 3: Fetch the chords from the chords table
            const chords = await database.getAllAsync<{
                id: number;
                name: string;
                // other chord properties
            }>(`SELECT * FROM chords WHERE id IN (${chordIds.join(',')})`);

            // Step 4: Return the jam with the corresponding chords
            return {
                ...jam,
                chords, // Add the fetched chords to the jam object
            };
        }));

        // Step 5: Update the state with the jam data including the chords
        setChordProgressions(jamsWithChords);
        setChordsLoading(false);
    };

    const handleDelete = async (id: number) => {
        try {
            database.runAsync("DELETE FROM ChordProgressions WHERE id = ?", [id]);
            loadData();
        }
        catch (error) {
            console.log(error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadData(); // Fetch data when the screen is focused
        }, [])
    );

    return (
        <View style={{backgroundColor: '#000000', flex: 1}}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16}}>My Chord Progressions</Text>
            <SafeAreaView style={{ }}>
                <View>
                    {chordsLoading ? (
                        <View style={{marginTop: 24}}>
                            <ActivityIndicator size="large" color="#85B59C" />
                        </View>
                    ) : (
                        <View>
                            {chordProgressions &&
                                <FlatList keyExtractor={(item) => item.id.toString()} style={{marginBottom: 70 }} data={chordProgressions} renderItem={({ item }) => {
                                    return (
                                        <Link style={{flexDirection: 'row', gap: 8, backgroundColor: '#0F1914', margin: 10, borderRadius: 6,  padding: 16, position: 'relative' }}
                                              href={{
                                                  pathname: '/progressions/view',
                                                  params: { chords: JSON.stringify(item.chords) }
                                              }}>
                                            {item.chords && item.chords.map((chord) => {
                                                return (
                                                    <View key={chord.id}>
                                                        <Text style={styles.badge}>{chord.key}{chord.suffix}</Text>
                                                    </View>
                                                )
                                            })}
                                        </Link>
                                    )
                                }} />
                            }
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        backgroundColor: '#85B59C',
        color: 'black',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 8,
    },
    buttonStyle: {
        backgroundColor: '#85B59C',
        borderRadius: 4,
        alignItems: 'center',
        alignContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6
    },
    buttonTextStyle: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
        color: 'black'
    },
})