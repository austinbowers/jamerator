import {View, Text, TouchableOpacity, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import React, {useCallback, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";
import {useFocusEffect, Link} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";


export default function Chords() {

    const database = useSQLiteContext();
    const [chordProgressions, setChordProgressions] = useState<any>([]);

    const loadData = async () => {
        const result = await database.getAllAsync<{
            id: number;
            name: string;
            genre: string;
            difficulty: string;
            key: string;
            chords: string;
        }>("SELECT * FROM ChordProgressions ORDER BY genre ASC");
        setChordProgressions(result);
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

    const ChordList = (chords) => {
        // Convert the string to an array
        const chordData = JSON.parse(chords);

        return (
            <View style={{flexDirection: 'row', gap: 8}}>
                {chordData.map((item) => (
                    <Text key={item.id} style={{marginTop: 8,color:'#FFFFFF', flexDirection: 'row', fontWeight: 'bold'}}>{item.name}</Text>
                ))}
            </View>
        );
    };

    return (
        <View style={{backgroundColor: '#0A130E', flex: 1}}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20, paddingHorizontal: 16, paddingVertical: 24}}>Chord Progressions</Text>
            <SafeAreaView style={{ }}>
                <View>
                    {chordProgressions &&
                        <FlatList keyExtractor={(item) => item.id.toString()} style={{marginBottom: 70 }} data={chordProgressions} renderItem={({ item }) => {
                            return (
                                <View style={{flexDirection: 'column', gap: 8, backgroundColor: '#0F1914',  borderRadius: 6, margin: 10, padding: 16, position: 'relative' }}>
                                    {/*<Text style={{color: 'green'}}>{item.id}</Text>*/}
                                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>{item.name}</Text>
                                    <View style={{flexDirection: 'row', gap: 8 }}>
                                        <Text style={styles.badge}>{item.difficulty}</Text>
                                        <Text style={styles.badge}>{item.key}</Text>
                                        <Text style={styles.badge}>{item.genre}</Text>
                                    </View>
                                    <Text style={{color: 'white'}}>
                                        <View>
                                            {ChordList(item.chords)}
                                        </View>
                                    </Text>
                                    {/*<TouchableOpacity onPress={() => {handleDelete(item.id)}} style={{position: 'absolute', top: 16, right: 16}}>*/}
                                    {/*    <FontAwesome size={20} name="trash" color={'gray'} />*/}
                                    {/*</TouchableOpacity>*/}
                                    <View style={{position: 'absolute', top: 16, right: 16}}>
                                        <TouchableOpacity style={styles.buttonStyle}>
                                            <Link style={styles.buttonTextStyle}
                                                  href={{
                                                      pathname: '/progressions/view',
                                                      params: { id: item.id, name: item.name, difficulty: item.difficulty, key: item.key, genre: item.genre, chords: item.chords }
                                                  }}>View</Link>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }} />
                    }
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        backgroundColor: 'rgba(133,181,156,0.6)',
        color: 'black',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
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