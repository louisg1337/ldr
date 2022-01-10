import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function LoveHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Love Home Page</Text>
      <StatusBar style="auto" />
      <Button title='Received' onPress={() => navigation.navigate('LoveReceived')}/>
      <Button title='Quotes' onPress={() => navigation.navigate('LoveQuotes')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
