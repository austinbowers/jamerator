import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import OpenAI from "openai";
// const client = new OpenAI();
//
// const completion = await client.chat.completions.create({
//     model: "gpt-4o",
//     messages: [{
//         role: "user",
//         content: "Write a one-sentence bedtime story about a unicorn.",
//     }],
// });
//
// console.log(completion.choices[0].message.content);


const ChordDisplay = () => {
    const frets = 5; // Number of frets to display

    const progression = [
        {
            name: 'C#m',
            barredFret: 4,
            positions: [
                { string: 'E', fret: 4 },
                { string: 'A', fret: 4 },
                { string: 'D', fret: 6 },
                { string: 'G', fret: 6 },
                { string: 'B', fret: 5 },
                { string: 'e', fret: 4 },
            ],
        },
        {
            name: 'A',
            barredFret: null,
            positions: [
                { string: 'E', fret: 0 },
                { string: 'A', fret: 0 },
                { string: 'D', fret: 2 },
                { string: 'G', fret: 2 },
                { string: 'B', fret: 2 },
                { string: 'e', fret: 0 },
            ],
        },
        {
            name: 'Bm',
            barredFret: 2,
            positions: [
                { string: 'E', fret: 2 },
                { string: 'A', fret: 2 },
                { string: 'D', fret: 4 },
                { string: 'G', fret: 4 },
                { string: 'B', fret: 3 },
                { string: 'e', fret: 2 },
            ],
        },
        {
            name: 'G',
            barredFret: null,
            positions: [
                { string: 'E', fret: 3 },
                { string: 'A', fret: 2 },
                { string: 'D', fret: 0 },
                { string: 'G', fret: 0 },
                { string: 'B', fret: 0 },
                { string: 'e', fret: 3 },
            ],
        },
    ];

    // Compute the visual positions of the chords
    const visualChords = useMemo(() => {
        return progression.map((chord) => {
            const minFret = Math.min(
                ...chord.positions.filter((p) => p.fret > 0).map((p) => p.fret)
            );

            const fretOffset = minFret > 1 ? minFret - 1 : 0;

            return {
                ...chord,
                visualBarredFret: chord.barredFret
                    ? chord.barredFret - fretOffset
                    : null,
                visualPositions: chord.positions.map((pos) => ({
                    ...pos,
                    visualFret: pos.fret > 0 ? pos.fret - fretOffset : 0,
                })),
            };
        });
    }, [progression]);

    return (
        <View style={styles.container}>
            <View>
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
                                {chord.visualBarredFret === index && (
                                    <View style={styles.barreChord}>
                                        <Text style={styles.barreChordText}>
                                            {chord.barredFret}fr
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
                                            style={[styles.string]}
                                        >
                                            {/* Display finger position if it matches the current fret and does not equal the barred fret */}
                                            {position && position.visualFret === index && position.visualFret !== chord.visualBarredFret && position.visualFret !== 0 && (
                                                <View  style={styles.fingerTextWrapper}>
                                                    <Text style={styles.fingerText}>
                                                        {position.fret}
                                                    </Text>
                                                </View>
                                            )}
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
        marginBottom: 12,
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
        zIndex: 1,
        width: '110%',
        textAlign: 'center',
        alignItems: 'center',
        height: 14,
        left: -8,
        backgroundColor: '#85B59C',
        color: 'black',
        borderRadius: 12,
        fontWeight: 'bold',
    },
    barreChordText: {
        position: 'absolute',
        left: 185,
        top: -5,
        color: '#85B59C',
        fontSize: 18,
        fontWeight: 'semibold',
    },
    string: {
        width: 1.5,
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
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
});

export default ChordDisplay;
