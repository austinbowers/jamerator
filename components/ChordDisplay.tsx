import React, {useMemo, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ActionSheetIOS,
} from 'react-native';
import { fetchChatCompletion} from "@/scripts/api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useSQLiteContext} from "expo-sqlite";

const ChordDisplay = () => {


    const database = useSQLiteContext();
    const [progression, setProgression] = useState([]);
    const [selectedKey, setSelectedKey] = useState('Random');
    const [selectedGenre, setSelectedGenre] = useState('Random');

    const prompt = `Using references from music theory and common finger positions for guitar chords, return me an array (without the \`\`\`json header) of a random ${
        selectedGenre === 'Random' ? '' : selectedGenre
    } guitar chord progression ${
        selectedKey !== 'Random' ? 'in the key of ' + selectedKey : 'in a random key'
    } Double-check each chord finger positioning and barred fret for accuracy. A fret of -1 represents a string that should not be played. A finger of 1 indicates pointer finger, a finger of 2 indicates middle finger, a finger of 3 indicates ring finger, and a finger of 4 indicates pinky. Double-check and make sure the finger number is accurate for what a human can actually play. 'bars' indicates which number bar in the progression this chord should be played during. Double-check for missing finger positions.

The response must follow this strict format:

[{
    "name": "VI IV",
    "genre": "Rock",
    "difficulty": "Easy",
    "key": "E",
    "chords": [
        {
            "name": "C#m",
            "barredFret": 4,
            "positions": [
                { "string": "E", "fret": -1, "finger": 0 },
                { "string": "A", "fret": 4, "finger": 1 },
                { "string": "D", "fret": 6, "finger": 3 },
                { "string": "G", "fret": 6, "finger": 4 },
                { "string": "B", "fret": 5, "finger": 2 },
                { "string": "e", "fret": 4, "finger": 1 }
            ],
        },
        {
            "name": "A",
            "barredFret": null,
            "positions": [
                { "string": "E", "fret": -1, "finger": 0 },
                { "string": "A", "fret": 0, "finger": 0 },
                { "string": "D", "fret": 2, "finger": 1 },
                { "string": "G", "fret": 2, "finger": 2 },
                { "string": "B", "fret": 2, "finger": 3 },
                { "string": "e", "fret": 0, "finger": 0 }
            ],
        }
    ]
}]`;

    const [chordsLoading, setChordsLoading] = useState(false)
    const getCompletion = async () => {
        setChordsLoading(true)
        try {
            const response = await fetchChatCompletion(prompt);
            if(response.length > 0)
                console.log(response);
                setProgression(JSON.parse(response));
                await handleSave(JSON.parse(response))
        }
        catch (error) {
            console.error("API Error:");
            throw error;
        }
        finally {
            setChordsLoading(false)
        }
    };

    const frets = 5; // Number of frets to display

    // Compute the visual positions of the chords
    const visualChords = useMemo(() => {
        if(progression.length > 0)
        return progression[0].chords.map((chord) => {
            const minFret = Math.min(
                ...chord.positions.filter((p) => p.fret > 0).map((p) => p.fret)
            );

            // Only apply fret offset if it's a barre chord AND the barredFret is greater than 1
            const fretOffset = chord.barredFret && chord.barredFret > 1 ? minFret - 1 : 0;

            return {
                ...chord,
                visualBarredFret: chord.barredFret ? chord.barredFret - fretOffset : null,
                visualPositions: chord.positions.map((pos) => ({
                    ...pos,
                    visualFret: pos.fret > 0 ? pos.fret - fretOffset : pos.fret,
                })),
            };
        });
    }, [progression]);

    const keys = [
        "Random", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
        "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"
    ];

    const genres = [
        "Random", "Rock", "Blues", "Jazz", "Pop", "Folk", "Country"
    ]

    const showKeyPicker = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: [...keys, "Cancel"],
                cancelButtonIndex: keys.length,
            },
            (buttonIndex) => {
                if (buttonIndex !== keys.length) {
                    setSelectedKey(keys[buttonIndex]);
                }
            }
        );
    };

    const showGenrePicker = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: [...genres, "Cancel"],
                cancelButtonIndex: genres.length,
            },
            (buttonIndex) => {
                if (buttonIndex !== genres.length) {
                    setSelectedGenre(genres[buttonIndex]);
                }
            }
        );
    };

    const handleSave = async (res) => {
        console.log(res)
        if(res.length > 0)
            database.runAsync("INSERT INTO ChordProgressions (name, genre, difficulty, key, chords) VALUES (?,?,?,?,?);", [
                res[0].name,
                res[0].genre,
                res[0].difficulty,
                res[0].key,
                JSON.stringify(res[0].chords),
            ]);
    }

    return (
        <View style={styles.container}>
            {/* Genre and Key Selectors */}
            <View style={{marginTop: 24}}>
                <View style={ styles.gridContainer }>
                    <View style={styles.gridItemTwo}>
                        <TouchableOpacity onPress={showKeyPicker} style={styles.buttonOutlineStyle}>
                            <Text style={styles.buttonOutlineTextStyle}>Select Key</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.gridItemTwo}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#85B59C', width: '100%', textAlign: 'center', padding: 2 }}>{selectedKey}</Text>
                    </View>
                    <View style={styles.gridItemTwo}>
                        <TouchableOpacity onPress={showGenrePicker} style={styles.buttonOutlineStyle}>
                            <Text style={styles.buttonOutlineTextStyle}>Select Genre</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.gridItemTwo}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#85B59C', width: '100%', textAlign: 'center', padding: 2 }}>{selectedGenre}</Text>
                    </View>
                </View>
            </View>
            {/* Generate and Loading Indicator*/}
            {chordsLoading ? (
                <View style={{marginTop: 32}}>
                    <ActivityIndicator size="large" color="#85B59C" />
                </View>
            ) : (
                <View style={{marginTop: 32}}>
                    <TouchableOpacity onPress={getCompletion} style={styles.gridContainer}>
                        <View style={styles.gridItemFull}>
                            <View style={styles.buttonStyle}>
                                <FontAwesome size={18} name="music" />
                                <Text style={styles.buttonTextStyle}>Generate Jam</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
            {visualChords &&
            <View>
                <View style={{ marginTop: 64, marginBottom: 40, flexDirection: 'row', justifyContent: 'space-between'}}>
                    {visualChords.map((chord) => (
                        <Text style={{color: 'white', flexGrow: 1, fontSize: 24, fontWeight: 'bold', marginRight: 24}} key={chord.name}>
                            {chord.name}
                        </Text>
                    ))}
                </View>
                {visualChords.map((chord) => (
                    <View key={chord.name} style={styles.chordContainer}>
                        <Text style={styles.chordName}>{chord.name}</Text>
                        {/* Loop through each fret position */}
                        {[...Array(frets)].map((_, index) => (
                            <View
                                key={index}
                                style={[styles.fretRow, index === 0 && styles.firstFret]}
                            >
                                {/* Display barre chord if it exists at the current fret */}
                                {chord.visualBarredFret === index + 1 && (
                                    <View style={styles.barreChord}>
                                        <Text style={styles.barreChordText}>
                                            {chord.barredFret}
                                        </Text>
                                    </View>

                                )}

                                {/* Loop through each string to display finger positions */}
                                {['E', 'A', 'D', 'G', 'B', 'e'].map((string) => {
                                    const position = chord.visualPositions.find(
                                        (p) => p.string === string
                                    );
                                    return (
                                        <View
                                            key={string}
                                            style={[(position && position.fret !== -1) ? styles.string : styles.lightString]}
                                        >
                                            {/* Display finger position if it matches the current fret and does not equal the barred fret */}
                                            {position && position.visualFret === index + 1 && position.visualFret !== chord.visualBarredFret && position.visualFret !== 0 ? (
                                                <View style={styles.fingerTextWrapper}>
                                                    <Text style={styles.fingerText}>
                                                        {position.finger}
                                                    </Text>
                                                </View>
                                            ) : position && position.fret === -1 && index === 0 ? (
                                                <View>
                                                    <Text style={styles.unPlayedStringStyle}>
                                                        X
                                                    </Text>
                                                </View>
                                            ) : position && position.fret === 0 && index === 0 ? (
                                                <View>
                                                    <Text style={styles.unPlayedStringStyle}>
                                                        O
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                ))}
            </View>}
        </View>

    );
};

const styles = StyleSheet.create({
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
    buttonOutlineStyle: {
        borderColor: '#85B59C',
        borderWidth: 1,
        color: '#85B59C',
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
        color: '#85B59C',
    },
    buttonTextStyle: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        color: 'black'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
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
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "center",
        columnGap: 12,
        rowGap: 24,
    },
    gridItemTwo: {
        width: '48.3%',
        justifyContent: "center",
        alignItems: "center",
    },
    gridItemFull: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
    }
});

export default ChordDisplay;
