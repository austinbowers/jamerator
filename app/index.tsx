import { View, Image } from "react-native";

export default function Index() {
  return (
      <View style={{flex: 1, backgroundColor: '#0E1614', alignItems: 'center'}}>
          <Image source={require('../assets/images/Jamerator.png')} style={{flex: 1, width: 200, height: null, resizeMode: 'contain'}}/>
      </View>
  );
}
