import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { signUserOut } from '../firebase';
import { getData } from '../asyncStorage';

export default function Home({ navigation }) {
  const handleSignOut = async () => {
    try {
      await signUserOut()
    } catch (error) {
      alert(error)
    }
  }

  const test = async () => {
    try {
      await deleteDatabase('users', '')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={styles.container}>
      <Text>Plain Home</Text>
      <Button title="Sign Out" onPress={() => handleSignOut()}/>
      <Button title="Retrieve" onPress={() => test()}/>
      <StatusBar style="auto" />
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
