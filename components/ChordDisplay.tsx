import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import { fetchChatCompletion} from "@/scripts/api";
import { Picker } from "@react-native-picker/picker";

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

    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedKey, setSelectedKey] = useState("Random");

    const prompt = `using references from music theory and common finger positions for guitar chords, return me an array (without the \`\`\`json header) of a random ${selectedGenre ?? ''} guitar chord progression ${selectedKey !== 'Random' ? 'in the key of ' + selectedKey : 'in a random key'} and only return the array starting from '[' using this strict data structure format for the chords and double check each chord finger positioning and barred fret for accuracy. a fret of -1 represents a string that should not be played. a finger of 1 indicates pointer finger, a finger of 2 indicates middle finger, a finger of 3 indicates ring finger, a finger of 4 indicates pinky. Double check and make sure finger number is accurate of what a human can actually play. 'bars' is which number bar in the progression this chord should be played during.:
` +
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
        "        \"bars\": [1],\n" +
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
            <Picker
                selectedValue={selectedKey}
                onValueChange={(itemValue) => setSelectedKey(itemValue)}
                style={{ height: 50, width: 300, marginBottom: 180 }}
            >
                <Picker.Item label="Random Key" value="Random" />

                {/* Major Keys */}
                <Picker.Item label="C Major" value="C" />
                <Picker.Item label="C# Major / Db Major" value="C#" />
                <Picker.Item label="D Major" value="D" />
                <Picker.Item label="D# Major / Eb Major" value="D#" />
                <Picker.Item label="E Major" value="E" />
                <Picker.Item label="F Major" value="F" />
                <Picker.Item label="F# Major / Gb Major" value="F#" />
                <Picker.Item label="G Major" value="G" />
                <Picker.Item label="G# Major / Ab Major" value="G#" />
                <Picker.Item label="A Major" value="A" />
                <Picker.Item label="A# Major / Bb Major" value="A#" />
                <Picker.Item label="B Major" value="B" />

                {/* Minor Keys */}
                <Picker.Item label="C Minor" value="Cm" />
                <Picker.Item label="C# Minor / Db Minor" value="C#m" />
                <Picker.Item label="D Minor" value="Dm" />
                <Picker.Item label="D# Minor / Eb Minor" value="D#m" />
                <Picker.Item label="E Minor" value="Em" />
                <Picker.Item label="F Minor" value="Fm" />
                <Picker.Item label="F# Minor / Gb Minor" value="F#m" />
                <Picker.Item label="G Minor" value="Gm" />
                <Picker.Item label="G# Minor / Ab Minor" value="G#m" />
                <Picker.Item label="A Minor" value="Am" />
                <Picker.Item label="A# Minor / Bb Minor" value="A#m" />
                <Picker.Item label="B Minor" value="Bm" />
            </Picker>
            <Picker
                selectedValue={selectedGenre}
                onValueChange={(itemValue) => setSelectedGenre(itemValue)}
                style={{ height: 50, width: 300, marginBottom: 180 }}
            >
                <Picker.Item label="Rock" value="rock" />
                <Picker.Item label="Blues" value="blues" />
                <Picker.Item label="Jazz" value="jazz" />
                <Picker.Item label="Pop" value="pop" />
            </Picker>
            {chordsLoading ? (
                <View style={{marginTop: 20}}>
                    <ActivityIndicator size="large" color="#85B59C" />
                </View>
            ) : (
                <TouchableOpacity onPress={getCompletion} style={styles.buttonStyle}>
                    <Text style={{fontWeight: 'bold',fontSize: 16,  textAlign: 'center'}}>Generate Jam</Text>
                </TouchableOpacity>
            )}
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
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#85B59C',
        borderRadius: 6,
        marginTop: 20,
        width: 280,
        alignItems: 'center',
        alignContent: 'center',
        padding: 16,
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
    }
});

export default ChordDisplay;
