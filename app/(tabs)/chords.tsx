import {View, TextInput, Text, TouchableOpacity, FlatList, SafeAreaView, ScrollView} from 'react-native';
import {useCallback, useEffect, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";
import {useFocusEffect} from "expo-router";

export default function Chords() {

    const database = useSQLiteContext();
    const [chordProgressions, setChordProgressions] = useState<any>([]);
    const [name, setName] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [difficulty, setDifficulty] = useState<string>('');
    const [key, setKey] = useState<string>('');
    const [chords, setChords] = useState<string>('');

    const loadData = async () => {
        const result = await database.getAllAsync<{
            id: number;
            name: string;
            genre: string;
            difficulty: string;
            key: string;
            chords: string;
        }>("SELECT * FROM ChordProgressions");
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

    const handleSave = async () => {
        database.runAsync("INSERT INTO ChordProgressions (name, genre, difficulty, key, chords) VALUES (?,?,?,?,?);", [
            name,
            genre,
            difficulty,
            key,
            chords,
        ]);
        loadData();
    }

    useFocusEffect(
        useCallback(() => {
            loadData(); // Fetch data when the screen is focused
        }, [])
    );

    return (
        <View style={{backgroundColor: '#0A130E', flex: 1,}}>
            <SafeAreaView style={{}}>
                <View>
                    {chordProgressions &&
                        <FlatList data={chordProgressions} renderItem={({ item }) => {
                            return (
                                <View style={{flexDirection: 'column', gap: 8, backgroundColor: 'darkgreen', borderRadius: 12, margin: 10, padding: 10}}>
                                    <Text style={{color: 'green'}}>{item.id}</Text>
                                    <Text style={{color: 'white'}}>Name: {item.name}</Text>
                                    <Text style={{color: 'white'}}>Genre: {item.genre}</Text>
                                    <Text style={{color: 'white'}}>Difficulty: {item.difficulty}</Text>
                                    <Text style={{color: 'white'}}>Key: {item.key}</Text>
                                    <Text style={{color: 'white'}}>Chords: {item.chords}</Text>
                                    <TouchableOpacity onPress={() => {handleDelete(item.id)}} style={{}}>
                                        <Text style={{color: 'white'}}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }} />
                    }
                </View>
            </SafeAreaView>
        </View>
    );
}