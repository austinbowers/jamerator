import {View, Text, StyleSheet, ScrollView} from "react-native";
import {useLocalSearchParams, Stack, useNavigation} from "expo-router";
import React, {useEffect, useMemo} from "react";

export default function ProgressionView() {

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: '',
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: '#0A130E',
            },
            headerTintColor: '#85B59C',
        });
    }, [navigation]);


    const ChordList = (chords) => {
        // Convert the string to an array
        const chordData = JSON.parse(chords);
        const frets = 5; // Number of frets to display

        // Compute the visual positions of the chords
        const visualChords = useMemo(() => {
                return chordData.map((chord) => {
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
        }, [chordData]);
        return (
            <View>
                <Text style={{textAlign: 'center', color: '#85B59C', fontSize: 18, fontWeight: 'normal', marginTop: 32}}>{name}</Text>
                <View style={{ marginTop: 40, marginBottom: 32, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    {visualChords.map((chord) => (
                        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold'}} key={chord.id}>
                            {chord.name}
                        </Text>
                    ))}
                </View>
                {visualChords.map((chord) => (
                    <View key={chord.id} style={styles.chordContainer}>
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
                                                        {/*{position.finger}*/}
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
        )
    };

    const { name } = useLocalSearchParams<{ name: string }>();
    const { chords } = useLocalSearchParams<{ chords: string }>();
    return (
        <ScrollView style={{backgroundColor: '#0A130E', flex: 1}}>
            <View>
                {ChordList(chords)}
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