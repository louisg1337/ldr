import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { manageUser, signUserOut } from '../firebase';

export default function Home({ navigation }) {
  const handleSignOut = async () => {
    try {
      await signUserOut()
    } catch (error) {
      alert(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text>Plain Home</Text>
      <Button title="Sign Out" onPress={() => handleSignOut()}/>
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
