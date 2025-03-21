import { View, ScrollView, StyleSheet} from 'react-native';
import ChordDisplay from "@/components/ChordDisplay";

export default function Index() {

    return (
        <View style={{backgroundColor: '#0A130E'}}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: '#0A130E' }}>
                <ChordDisplay/>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    // Additional styles can be added here
});
