import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function LoveReceived({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Love Received Page</Text>
      <StatusBar style="auto" />
      <Button title='Back' onPress={() => navigation.goBack()}/>
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
