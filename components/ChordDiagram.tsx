import {Text, View, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import {useTheme} from "@/scripts/ThemeContext";

export default function ChordDiagram({chordData}) {

    const { theme, toggleTheme } = useTheme();

    const processBaseFret = (frets) =>
        Math.max(...frets) > 4 ? Math.min(...frets.filter((f) => f > 0)) : 1;

    const parseFretNotation = (notation) => {
        return notation.split('').map(f => {
            if (f === 'x') return -1;
            if (!isNaN(f)) return Number(f);
            return f.charCodeAt(0) - 87; // 'a' -> 10, 'b' -> 11, ..., 'z' -> 35
        });
    };

    const [data, setData] = useState<any>();

    useEffect(() => {
        if (!chordData) {
            console.warn("No chord found");
            return;
        }

        try {
            if (chordData.position_frets) {
                const processedFrets = parseFretNotation(chordData.position_frets);
                const processedBaseFret = processBaseFret(processedFrets);
                setData({ ...chordData, processedBaseFret, processedFrets });
            } else {
                console.warn("chordData.position_frets is missing");
            }
        } catch (error) {
            console.error("Error processing chord data:", error);
        }
    }, [chordData]);


    return (
        <View>
            {data &&
                <View key={data.id} style={styles.chordContainer}>
                    <Text style={[styles.chordName, {color: theme.text}]}>{data.key}{data.suffix}</Text>
                    {/* Loop through each fret position */}
                    {[...Array(4)].map((_, fretIndex) => (
                        <View
                            key={fretIndex}
                            style={[styles.fretRow, {borderColor: theme.primary}]}
                        >
                            {fretIndex === 0 && data.processedBaseFret === 1 && (
                                <View style={{position: 'absolute', top:-3, width: '100%', height: 4, backgroundColor: theme.primary}}></View>
                            )}
                            {fretIndex === 0 && data.processedBaseFret !== 1 && (
                                <View style={{position: 'absolute', top:0, width: '100%', height: 2, backgroundColor: theme.primary}}></View>
                            )}
                            {data.processedBaseFret > 1 && fretIndex === 0 &&
                                <Text style={{position: 'absolute', left: -45, top:9,  color: theme.text, fontSize: 16, fontWeight: 'bold'}}>{data.processedBaseFret}fr</Text>
                            }
                            {/* Display barre chord if it exists at the current fret */}
                            {data.barres && data.barres - data.processedBaseFret === fretIndex && (
                                <View style={{width: '100%', position: 'absolute', height: 22, backgroundColor: theme.primary, opacity: .6,}}>
                                </View>
                            )}
                            {/* Loop through each string (E, A, D, G, B, e) */}
                            {['E', 'A', 'D', 'G', 'B', 'e'].map((string, stringIndex) => {
                                // Get the fret position for the current string
                                const fret = data.processedFrets ? data.processedFrets[stringIndex] : null;

                                return (
                                    <View key={string} style={[styles.string, {width: 2 + (-stringIndex * .2), backgroundColor: theme.primary}]}>
                                        {/* Display finger position if it matches the current fret and does not equal 'x' */}
                                        { fret - data.processedBaseFret === fretIndex && (fret !== data.barres) ? (
                                            <View style={styles.fingerTextWrapper}>
                                                {(data.barres - data.processedBaseFret === fretIndex) ? (
                                                    <View>
                                                        {stringIndex === 0 ? (
                                                            <View style={[styles.barreChordStringLeft, {backgroundColor: theme.primary}]}>
                                                                <Text style={[styles.fingerText, {color: theme.background, backgroundColor: theme.primary}]}>{data.position_fingers[stringIndex]}</Text>
                                                            </View>
                                                        ) : stringIndex === 5 ? (
                                                            <View style={styles.fingerTextWrapper}>
                                                                <View style={[styles.barreChordStringRight, {backgroundColor: theme.primary}]}>
                                                                    <Text style={[styles.fingerText, {color: theme.background, backgroundColor: theme.primary}]}>{data.position_fingers[stringIndex]}</Text>
                                                                </View>
                                                            </View>
                                                        ) : (
                                                            <View style={styles.fingerTextWrapper}>
                                                                <View style={[styles.barreChord, {backgroundColor: theme.primary}]}>
                                                                    <Text style={[styles.fingerText, {color: theme.background, backgroundColor: theme.primary}]}>{data.position_fingers[stringIndex]}</Text>
                                                                </View>
                                                            </View>
                                                        )
                                                        }
                                                    </View>

                                                ) : (
                                                    <Text style={[styles.fingerText, {color: theme.background, backgroundColor: theme.primary}]}>{data.position_fingers[stringIndex]}</Text>
                                                )}
                                            </View>
                                        ) : fret === -1 && fretIndex === 0 ? (
                                            <View>
                                                <Text style={[styles.unPlayedStringStyle, {color: theme.primary}]}>
                                                    X
                                                </Text>
                                            </View>
                                        ) : fret === 0 && fretIndex === 0 ? (
                                            <View>
                                                <Text style={[styles.openStringStyle, {backgroundColor: theme.primary}]}>
                                                </Text>
                                            </View>
                                        ) : null }
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            }
            </View>
    )
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
        fontWeight: 'bold',
        marginBottom: 24,
        fontSize: 18,
    },
    fretRow: {
        width: 160, // Adjust width to 80% of the screen width
        height: 40,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    barreChord: {
        zIndex: 100,
        width: 34,
        textAlign: 'center',
        alignItems: 'center',
        height: 22,
        borderRadius: 1,
        fontWeight: 'bold',
    },
    barreChordStringLeft: {
        zIndex: 100,
        paddingLeft: 2,
        paddingRight: 6,
        textAlign: 'center',
        alignItems: 'center',
        height: 22,
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomRightRadius: 1,
        borderTopRightRadius: 1,
        fontWeight: 'bold',
    },
    barreChordStringRight: {
        zIndex: 100,
        paddingLeft: 6,
        paddingRight: 2,
        textAlign: 'center',
        alignItems: 'center',
        height: 22,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 1,
        borderTopLeftRadius: 1,
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
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
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
});