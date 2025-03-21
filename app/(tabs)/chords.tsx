import { View, ScrollView, Text } from 'react-native';
export default function Chords() {
    return (
        <View style={{backgroundColor: '#0A130E', flex: 1,}}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: '#0A130E' }}>
                <Text style={{color: 'white', marginTop: 200, fontSize: 20 }}>More coming soon...</Text>
            </ScrollView>
        </View>
    );
}