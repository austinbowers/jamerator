import {ActivityIndicator, ScrollView, StyleSheet, Text,  View} from "react-native";
import ChordDiagram from "@/components/ChordDiagram";
import React, {useEffect, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTheme } from '@/scripts/ThemeContext';
import CustomButton from "@/components/Button";
import CustomOutlineButton from "@/components/OutlineButton";
import FlashMessage, { showMessage } from 'react-native-flash-message';

export default function Index() {

    const { theme } = useTheme();
    const db = useSQLiteContext();
    const [chordsLoading, setChordsLoading] = useState(false)
    const [progressionData, setProgressionData] = useState([])
    const [chordData, setChordData] = useState([])
    const { showActionSheetWithOptions } = useActionSheet();
    const [selectedKey, setSelectedKey] = useState('E');
    const [selectedGenre, setSelectedGenre] = useState('Blues');
    const keys = [
        "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
        "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"
    ];
    const genres = [
        "Rock", "Blues", "Jazz", "Pop", "Folk", "Country", "Funk"
    ];

    useEffect(() => {
        const fetchChords = async () => {
            if (progressionData.length > 0) {
                setChordsLoading(true);
                let chordsArray = [];
                for (const chord of progressionData) {
                    try {
                        const result = await db.getFirstAsync(
                            "SELECT * FROM chords WHERE key = $keyValue AND suffix = $suffixValue ORDER BY RANDOM() LIMIT 1",
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

    const showSuccessAlert = () => {
        showMessage({
            message: "Saved Successfully",
            description: "Chord progression saved to My Jams",
            type: "success",
            icon: "success",
        });
    };

    const handleSave = async () => {
        await db.runAsync(
            `CREATE TABLE IF NOT EXISTS my_jams (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             chord_ids TEXT,
             progression_key TEXT,
             progression_genre TEXT
             );`
        );
        const chordIds = chordData.map(chord => chord.id).join(',');
        await db.runAsync(
            "INSERT INTO my_jams (chord_ids, progression_key, progression_genre) VALUES (?, ?, ?);",
            [chordIds, selectedKey, selectedGenre]
        );
        showSuccessAlert();
    };

    const getProgressions = async () => {
        try {
            const result = await db.getFirstAsync(
                'SELECT * FROM progressions WHERE genre = ? AND key = ? ORDER BY RANDOM() LIMIT 1',
                [selectedGenre, selectedKey]
            );
            setProgressionData(JSON.parse(result.progressions));
        } catch (error) {
            console.error("Error querying SQLite database", error);
        }
    };

    return (
        <View style={{flex:1, backgroundColor: theme.background}}>
            <FlashMessage position="top" />
            <ScrollView>
                {/* Genre and Key Selectors */}
                <View style={{paddingTop: 24, paddingHorizontal: 16}}>
                    <View style={ styles.gridContainer }>
                        <View style={styles.gridItemTwo}>
                            <CustomButton title={'Key: ' + selectedKey} onPress={showKeyPicker} ></CustomButton>
                        </View>
                        <View style={styles.gridItemTwo}>
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
                            <CustomButton iconName={'music'} title={'Generate'} onPress={getProgressions}></CustomButton>
                        </View>
                    )}
                </View>
                {progressionData.length > 0 &&
                    <View style={{paddingHorizontal:16, alignItems: 'center'}}>
                        <CustomOutlineButton iconName={'save'} onPress={handleSave} title={"Add to My Jams"}></CustomOutlineButton>
                        <View style={{marginTop: 32, backgroundColor: theme.background, flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'stretch' }}>
                            {chordData && chordData.map((data, index) => (
                                <View key={index} style={{backgroundColor: theme.primary900, width: 'auto', minWidth: '23.5%', flex:1, margin:2, padding: 10}}>
                                    <Text style={{color: theme.text, fontSize: 16, fontWeight: 'bold'}}>{data.key}{data.suffix}</Text>
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
        </View>
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