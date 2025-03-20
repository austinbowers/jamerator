import { View, Text, Button } from 'react-native';
import { fetchChatCompletion} from "@/scripts/api";

const getCompletion = async () => {
    const response = await fetchChatCompletion("Return only the JSON code of a random chord progression array with each chord having this data: [\n" +
        "    {\n" +
        "      name: 'Cmaj7',\n" +
        "      barredFret: null,\n" +
        "      positions: [\n" +
        "        { string: 'E', fret: 0 },\n" +
        "        { string: 'A', fret: 3 },\n" +
        "        { string: 'D', fret: 2 },\n" +
        "        { string: 'G', fret: 0 },\n" +
        "        { string: 'B', fret: 0 },\n" +
        "        { string: 'e', fret: 0 }\n" +
        "      ]\n" +
        "    }\n" +
        "]");
    console.log(response);
};

const OpenAi = () => {
    return (
            <View>
                <Text style={{color: 'white'}} onPress={getCompletion}>Test</Text>
            </View>
        )
}
export default OpenAi;