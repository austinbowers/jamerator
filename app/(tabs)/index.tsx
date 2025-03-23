import { View, ScrollView, StyleSheet} from 'react-native';
import ChordDisplay from "@/components/ChordDisplay";

export default function Index() {

    return (
        <View style={{backgroundColor: '#0A130E', height: '100%'}}>
            <ScrollView contentContainerStyle={{ backgroundColor: '#0A130E' }}>
                <ChordDisplay/>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    // Additional styles can be added here
});
