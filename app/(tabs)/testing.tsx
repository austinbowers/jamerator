import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as SQLite from 'expo-sqlite';
import {SQLiteProvider} from "expo-sqlite";
import React, {useEffect, useState} from "react";

const processBaseFret = (frets) =>
    Math.max(...frets) > 4 ? Math.min(...frets.filter((f) => f > 0)) : 1;

const parseFretNotation = (notation) => {
    return notation.split('').map(f => {
        if (f === 'x') return -1;
        if (!isNaN(f)) return Number(f);
        return f.charCodeAt(0) - 87; // 'a' -> 10, 'b' -> 11, ..., 'z' -> 35
    });
};
const getRandomNumber = () => Math.floor(Math.random() * 2447);
export default function Testing() {

    const [db, setDb] = useState<any>();
    const chordsDatabase = async () => {
        setDb(await SQLite.openDatabaseAsync('chords.db'))
    }

    const [data, setData] = useState<any>();
    const loadData = async () => {
        if (db) {
            const result = await db.getFirstAsync('SELECT * FROM chords ORDER BY RANDOM() LIMIT 1');
            const processedFrets = parseFretNotation(result.position_frets);
            const processedBaseFret = processBaseFret(processedFrets);
            setData({ ...result, processedBaseFret, processedFrets });
        }
    };

    useEffect(() => {
        chordsDatabase()
    }, []);

    return (
        <SQLiteProvider databaseName="chords.db" assetSource={{ assetId: require('@/assets/chords.db') }}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.buttonStyle} onPress={loadData}>
                    <Text style={styles.buttonTextStyle}>Load</Text>
                </TouchableOpacity>
                {/*{data &&*/}
                {/*    <View>*/}
                {/*        <Text style={{color: 'white'}}>id: {data.id}</Text>*/}
                {/*        <Text style={{color: 'white'}}>Chord key: {data.key} {data.suffix}</Text>*/}
                {/*        <Text style={{ color: 'white' }}>Fret positions:*/}
                {/*            {(data.processedFrets).map((fret, index) => (*/}
                {/*                <Text key={index} style={{ marginRight: 5 }}>*/}
                {/*                    {fret},*/}
                {/*                </Text>*/}
                {/*            ))}*/}
                {/*        </Text>*/}
                {/*        <Text style={{color: 'white'}}>Finger positions:*/}
                {/*            {(data.position_fingers || '').split('').map((finger, index) => (*/}
                {/*                <Text key={index} style={{ marginRight: 5 }}>*/}
                {/*                    {finger},*/}
                {/*                </Text>*/}
                {/*            ))}</Text>*/}
                {/*        <Text style={{color: 'white'}}>Bar: {data.barres}</Text>*/}
                {/*        <Text style={{color: 'white'}}>Capo: {data.capo}</Text>*/}
                {/*        <Text style={{color: 'white'}}>Base Fret: {data.processedBaseFret}</Text>*/}
                {/*    </View>*/}
                {/*}*/}
                {data &&
                    <View key={data.id} style={styles.chordContainer}>
                        <Text style={styles.chordName}>{data.key} {data.suffix}</Text>
                        {/* Loop through each fret position */}
                        {[...Array(4)].map((_, fretIndex) => (
                            <View
                                key={fretIndex}
                                style={[styles.fretRow, fretIndex === 0 && styles.firstFret]}
                            >
                                {fretIndex === 0 && data.processedBaseFret === 1 && (
                                    <View style={{position: 'absolute', top:-5, width: '100%', height: 5, backgroundColor: '#85B59C'}}></View>
                                )}
                                {fretIndex === 0 && data.processedBaseFret !== 1 && (
                                    <View style={{position: 'absolute', top:0, width: '100%', height: 2, backgroundColor: '#85B59C'}}></View>
                                )}
                                {data.processedBaseFret > 1 && fretIndex === 0 &&
                                <Text style={{position: 'absolute', left: -45, top:9,  color: 'white', fontSize: 16, fontWeight: 'bold'}}>{data.processedBaseFret}fr</Text>
                                }
                                {/* Display barre chord if it exists at the current fret */}
                                {data.barres && data.barres - data.processedBaseFret === fretIndex && (
                                    <View style={{width: '100%', position: 'absolute', height: 22, backgroundColor: '#85B59C', opacity: .6,}}>
                                    </View>

                                )}
                                {/* Loop through each string (E, A, D, G, B, e) */}
                                {['E', 'A', 'D', 'G', 'B', 'e'].map((string, stringIndex) => {
                                    // Get the fret position for the current string
                                    const fret = data.processedFrets ? data.processedFrets[stringIndex] : null;

                                    return (
                                        <View key={string} style={styles.string}>
                                            {/* Display finger position if it matches the current fret and does not equal 'x' */}
                                            { fret - data.processedBaseFret === fretIndex && (fret !== data.barres) ? (
                                                <View style={styles.fingerTextWrapper}>
                                                    <Text style={styles.fingerText}>{data.position_fingers[stringIndex]}</Text>
                                                </View>
                                            ) : fret === -1 && fretIndex === 0 ? (
                                                <View>
                                                    <Text style={styles.unPlayedStringStyle}>
                                                        X
                                                    </Text>
                                                </View>
                                            ) : fret === 0 && fretIndex === 0 ? (
                                                <View>
                                                    <Text style={styles.openStringStyle}>
                                                    </Text>
                                                </View>
                                            ) : null }
                                            {/* Display barre chord if it exists at the current fret and string */}
                                            {stringIndex === 0 ? (
                                                <View>
                                                    {data.barres && (data.barres - data.processedBaseFret === fretIndex) && (data.barres === fret) && (
                                                        <View style={styles.fingerTextWrapper}>
                                                            <View style={styles.barreChordStringLeft}>
                                                                <Text style={styles.fingerText}>{data.position_fingers[stringIndex]}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                </View>
                                            ) : stringIndex === 5 ? (
                                                <View>
                                                    {data.barres && (data.barres - data.processedBaseFret === fretIndex) && (data.barres === fret) && (
                                                        <View style={styles.fingerTextWrapper}>
                                                            <View style={styles.barreChordStringRight}>
                                                                <Text style={styles.fingerText}>{data.position_fingers[stringIndex]}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                </View>
                                            ) : (
                                                <View>
                                                    {data.barres && (data.barres - data.processedBaseFret === fretIndex) && (data.barres === fret) && (
                                                        <View style={styles.fingerTextWrapper}>
                                                            <View style={styles.barreChord}>
                                                                <Text style={styles.fingerText}>{data.position_fingers[stringIndex]}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                }
            </View>
        </SQLiteProvider>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#0A130E',
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
        alignContent: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    firstFret: {
        borderTopColor: '#85B59C',
    },
    barreChord: {
        zIndex: 100,
        width: 34,
        textAlign: 'center',
        alignItems: 'center',
        height: 22,
        backgroundColor: '#85B59C',
        borderRadius: 0,
        fontWeight: 'bold',
    },
    barreChordStringLeft: {
        zIndex: 100,
        paddingLeft: 2,
        paddingRight: 8,
        textAlign: 'center',
        alignItems: 'center',
        height: 22,
        backgroundColor: '#85B59C',
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8,
        fontWeight: 'bold',
    },
    barreChordStringRight: {
        zIndex: 100,
        paddingLeft: 8,
        paddingRight: 2,
        textAlign: 'center',
        alignItems: 'center',
        height: 22,
        backgroundColor: '#85B59C',
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
        fontWeight: 'bold',
    },
    barreChordFaded: {
        zIndex: 100,
        width: 40,
        textAlign: 'center',
        alignItems: 'center',
        height: 22,
        backgroundColor: '#85B59C',
        opacity: .5,
        borderRadius: 4,
        fontWeight: 'bold',
    },
    barreChordText: {
        position: 'absolute',
        left: 185,
        top: -6,
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
    openStringStyle: {
        color: '#85B59C',
        width: 9,
        height: 9,
        position: 'absolute',
        fontSize: 12,
        textAlign: 'center',
        borderRadius: 100,
        top: -22,
        left: -5,
        fontWeight: 'bold',
        backgroundColor: '#85B59C',
    },
    fretNumberStyle: {
        color: '#85B59C',
        width: 22,
        height: 22,
        fontSize: 16,
        textAlign: 'center',
        bottom: -50,
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