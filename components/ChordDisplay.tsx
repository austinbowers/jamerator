import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Button, ActivityIndicator, TouchableOpacity} from 'react-native';
import { fetchChatCompletion} from "@/scripts/api";


const ChordDisplay = () => {

    const [progression, setProgression] = useState([
        {
            name: 'C#m',
            barredFret: 4,
            positions: [
                { string: 'E', fret: -1, finger: 0 },
                { string: 'A', fret: 4, finger: 1 },
                { string: 'D', fret: 6, finger: 3 },
                { string: 'G', fret: 6, finger: 4 },
                { string: 'B', fret: 5, finger: 2 },
                { string: 'e', fret: 4, finger: 1 },
            ],
        },
        {
            name: 'A',
            barredFret: null,
            positions: [
                { string: 'E', fret: -1, finger: 0 },
                { string: 'A', fret: 0, finger: 0 },
                { string: 'D', fret: 2, finger: 1 },
                { string: 'G', fret: 2, finger: 2 },
                { string: 'B', fret: 2, finger: 3 },
                { string: 'e', fret: 0, finger: 0 },
            ],
        },
        {
            name: 'Bm',
            barredFret: 2,
            positions: [
                { string: 'E', fret: 2, finger: 0 },
                { string: 'A', fret: 2, finger: 1 },
                { string: 'D', fret: 4, finger: 3 },
                { string: 'G', fret: 4, finger: 4 },
                { string: 'B', fret: 3, finger: 2 },
                { string: 'e', fret: 2, finger: 1 },
            ],
        },
        {
            name: 'G',
            barredFret: null,
            positions: [
                { string: 'E', fret: 3, finger: 2 },
                { string: 'A', fret: 2, finger: 1 },
                { string: 'D', fret: 0, finger: 0 },
                { string: 'G', fret: 0, finger: 0 },
                { string: 'B', fret: 0, finger: 0 },
                { string: 'e', fret: 3, finger: 3 },
            ],
        },
    ]);
    const prompt = "using references from music theory and common finger positions for guitar chords, return me an array (without the ```json header) of a random jazz guitar chord progression and only return the array starting from '[' using this strict data structure format for the chords and double check each chord finger positioning and barred fret for accuracy. a fret of -1 represents a string that should not be played. a finger of 1 is index finger, a finger of 2 is middle finger, a finger of 3 is ring finger, a finger of 4 is pinky. Double check and make sure finger number is accurate of what a human can actually play.:\n" +
        "    {\n" +
        "        \"name\": \"C#m\",\n" +
        "        \"barredFret\": 4,\n" +
        "        \"positions\": [\n" +
        "            { \"string\": \"E\", \"fret\": -1, \"finger\": 0 },\n" +
        "            { \"string\": \"A\", \"fret\": 4, \"finger\": 1 },\n" +
        "            { \"string\": \"D\", \"fret\": 6, \"finger\": 3 },\n" +
        "            { \"string\": \"G\", \"fret\": 6, \"finger\": 4 },\n" +
        "            { \"string\": \"B\", \"fret\": 5, \"finger\": 2 },\n" +
        "            { \"string\": \"e\", \"fret\": 4, \"finger\": 1 }\n" +
        "        ],\n" +
        "    },";

    const [chordsLoading, setChordsLoading] = useState(false)
    const getCompletion = async () => {
        setChordsLoading(true)
        try {
            const response = await fetchChatCompletion(prompt);
            setProgression(JSON.parse(response));
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
        return progression.map((chord) => {
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

    return (
        <View style={styles.container}>
            {chordsLoading ? (
                <View style={{marginTop: 20}}>
                    <ActivityIndicator size="large" color="#85B59C" />
                </View>
            ) : (
                <TouchableOpacity onPress={getCompletion} style={styles.buttonStyle}>
                    <Text style={{fontWeight: 'bold'}}>Generate Jam</Text>
                </TouchableOpacity>
            )}
            <View>
                <View style={{ marginTop: 64, marginBottom: 40, flexDirection: 'row', justifyContent: 'space-between'}}>
                    {visualChords.map((chord, index) => (
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
                                {['E', 'A', 'D', 'G', 'B', 'e'].map((string, stringIndex) => {
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
                                                    <Text style={styles.unplayedStringStyle}>
                                                        X
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
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#85B59C',
        borderRadius: 6,
        marginTop: 20,
        width: 'auto',
        alignItems: 'center',
        alignContent: 'center',
        padding: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        // transform: 'scale(1)',
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
    unplayedStringStyle: {
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
    }
});

export default ChordDisplay;
