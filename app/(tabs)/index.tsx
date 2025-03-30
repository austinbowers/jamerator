import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ChordDiagram from "@/components/ChordDiagram";
import React, {useEffect, useState} from "react";
import {fetchChatCompletion} from "@/scripts/api";
import {useSQLiteContext} from "expo-sqlite";
import { useActionSheet } from '@expo/react-native-action-sheet';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from '@/scripts/ThemeContext';
import CustomButton from "@/components/Button";
import CustomOutlineButton from "@/components/OutlineButton";
import * as SQLite from 'expo-sqlite';



export default function Index() {
    const { theme, toggleTheme } = useTheme();

    const db = useSQLiteContext();


    const [chordsLoading, setChordsLoading] = useState(false)
    const [progressionData, setProgressionData] = useState([])
    const [chordData, setChordData] = useState([])
    useEffect(() => {
        const fetchChords = async () => {
            if (progressionData.length > 0) {
                setChordsLoading(true);
                let chordsArray = [];

                for (const chord of progressionData) {
                    try {
                        const result = await db.getFirstAsync(
                            "SELECT * FROM chords WHERE key = $keyValue AND suffix = $suffixValue ORDER BY id LIMIT 1",
                            { $keyValue: chord.key, $suffixValue: chord.suffix }
                        );

                        if (result) {
                            chordsArray.push(result);
                        } else {
                            console.error(`Chord not found in database: Key = ${chord.key}, Suffix = ${chord.suffix}`);
                        }
                    } catch (error) {
                        console.error("Database Error:", error);
                    }
                }
                setChordData(chordsArray);
                setChordsLoading(false);
            }
        };

        fetchChords();
    }, [progressionData]); // Dependency on progressionData

    const getCompletion = async () => {
        setChordsLoading(true);
        try {
            const response = await fetchChatCompletion(
                `Using music theory principles for a 6-string guitar, generate a random chord progression in the genre "${selectedGenre}" and key "${selectedKey}". 
                The progression should follow typical chord sequences based on the selected genre while adhering to the following requirements:
                
                - Output the progression in this format: 
                  [{key: 'A', suffix: 'add9'}, {key: 'D', suffix: '7'}, ...]
                  
                - The 'key' must be one of the following:
                  (A, Ab, B, Bb, C, C#, D, Db, E, E#, Eb, F, F#, G)
                
                - The 'suffix' must be selected from the following list:
                  (11, 13, 5, 6, 69, 7#9, 7, 7b5, 7b9, 7sus4, 9#11, 9, 9b5, /Ab, /B, /Bb, /Csharp, /C, /D, /E, /Eb, /Fsharp, /F, /G#, /G, add11, add9, alt, aug, aug7, aug9, dim, dim7, m11, m6, m69, m7, m7b5, m9, m9/C, m9/G, m/Ab, m/B, m/Bb, m/C#, m/C, m/D, m/E, m/Eb, m/F#, m/F, m/G#, m/G, madd9, maj11, maj13, maj7#5, maj7, maj7b5, maj7sus2, maj9, major, minor, mmaj11, mmaj7, mmaj7b5, mmaj9, sus, sus2, sus2sus4, sus4)
            
                - The chord progression should be musically coherent within the context of the selected genre and key.
                - Only return the chord progression as JSON code without any additional explanations or comments.
                
                Do not wrap the JSON output in JSON markers.`
            );
            const formattedString = response.replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
            const parsedArray = JSON.parse(formattedString);
            setProgressionData(parsedArray); // This triggers the useEffect to fetch chords
        } catch (error) {
            console.error("API Error:" + error);
            throw error;
        } finally {
            setChordsLoading(false);
        }
    };

    const { showActionSheetWithOptions } = useActionSheet();
    const [selectedKey, setSelectedKey] = useState('E');
    const [selectedGenre, setSelectedGenre] = useState('Blues');

    const keys = [
        "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
        "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"
    ];

    const genres = [
        "Rock", "Blues", "Jazz", "Pop", "Folk", "Country", "Funk", "Metal", "Neo-Soul"
    ]

    const showKeyPicker = () => {
        showActionSheetWithOptions({
            options: [...keys, "Cancel"],
            cancelButtonIndex: keys.length,
            tintColor: theme.primary,
        },(selectedIndex) => {
            if (selectedIndex !== keys.length) {
                setSelectedKey(keys[selectedIndex]);
            }
        });
    };

    const showGenrePicker = () => {
        showActionSheetWithOptions({
            options: [...genres, "Cancel"],
            cancelButtonIndex: genres.length,
            tintColor: theme.primary,
        },(selectedIndex) => {
            if (selectedIndex !== genres.length) {
                setSelectedGenre(genres[selectedIndex]);
            }
        });
    };


    const handleSave = async () => {
        // Step 1: Create the table if it doesn't already exist
        await db.runAsync(
            `CREATE TABLE IF NOT EXISTS my_jams (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             chord_ids TEXT,
             progression_key TEXT,
             progression_genre TEXT
             );`
        );

        // Step 2: Get all chord ids as a comma-separated string
        const chordIds = chordData.map(chord => chord.id).join(',');

        // Step 3: Insert the values into the `my_jams` table
        await db.runAsync(
            "INSERT INTO my_jams (chord_ids, progression_key, progression_genre) VALUES (?, ?, ?);",
            [chordIds, selectedKey, selectedGenre] // Correct parameter passing
        );
    };

    return (

        <ScrollView style={{flex:1, backgroundColor: theme.background}}>
            {/* Genre and Key Selectors */}
            <View style={{paddingTop: 24, paddingHorizontal: 16}}>
                <View style={ styles.gridContainer }>
                    <View style={styles.gridItemTwo}>
                        {/*<TouchableOpacity onPress={showKeyPicker} style={[styles.buttonOutlineStyle, {borderColor: theme.primary}]}>*/}
                        {/*    <Text style={[styles.buttonOutlineTextStyle, {color: theme.primary}]}>Key: </Text>*/}
                        {/*    <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: theme.text,}}>{selectedKey}</Text>*/}
                        {/*</TouchableOpacity>*/}
                        <CustomButton title={'Key: ' + selectedKey} onPress={showKeyPicker} ></CustomButton>
                    </View>
                    <View style={styles.gridItemTwo}>
                        {/*<TouchableOpacity onPress={showGenrePicker} style={[styles.buttonOutlineStyle, {borderColor: theme.primary}]}>*/}
                        {/*    <Text style={[styles.buttonOutlineTextStyle, {color: theme.primary}]}>Genre: </Text>*/}
                        {/*    <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: theme.text,}}>{selectedGenre}</Text>*/}
                        {/*</TouchableOpacity>*/}
                        <CustomButton title={'Genre: ' + selectedGenre} onPress={showGenrePicker}></CustomButton>

                    </View>
                </View>
            </View>
            {/* Generate and Loading Indicator*/}
            <View style={{paddingHorizontal: 16, paddingBottom: 16}}>
            {chordsLoading ? (
                <View style={{marginTop: 16}}>
                    <ActivityIndicator size="large" color="#85B59C" />
                </View>
            ) : (
                <View style={{marginTop: 16}}>
                    <CustomButton iconName={'music'} title={'Generate'} onPress={getCompletion}></CustomButton>
                </View>
            )}
            </View>
            {progressionData.length > 0 &&
                <View style={{paddingHorizontal:16, alignItems: 'center'}}>
                    <CustomOutlineButton iconName={'save'} onPress={handleSave} title={"Add to My Jams"}></CustomOutlineButton>
                    <View style={{marginTop: 32, backgroundColor: theme.background, flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'stretch' }}>
                        {chordData && chordData.map((data, index) => (
                            <View key={index} style={{backgroundColor: theme.primary900, width: 'auto', minWidth: '23.5%', flex:1, margin:2, padding: 12}}>
                                <Text style={{color: theme.text, fontSize: 18, fontWeight: 'bold'}}>{data.key}{data.suffix}</Text>
                            </View>
                        ))}
                    </View>
                </View>

            }


            <View style={{padding: 16}}>
                {chordData && chordData.map((data, index) => (
                    <ChordDiagram key={index} chordData={data}></ChordDiagram>
                ))}
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    buttonOutlineStyle: {
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
        alignContent: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: 12,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6
    },
    buttonOutlineTextStyle: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "center",
        columnGap: 14,
        rowGap: 24,
    },
    gridItemTwo: {
        width: '48%',
        justifyContent: "center",
        alignItems: "center",
    },
    gridItemFull: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
    },
    buttonStyle: {
        backgroundColor: '#85B59C',
        borderRadius: 6,
        alignItems: 'center',
        alignContent: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: 12,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6
    },
    buttonTextStyle: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        color: 'black'
    },
});