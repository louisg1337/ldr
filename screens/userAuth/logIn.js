import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, TextInput, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { signIn, manageUser } from '../../firebase';





export default function LogIn({ navigation }) {
  const [email, cEmail] = useState('')
  const [password, cPassword] = useState('')


  const handleLogIn = async () => {
    try {
      await signIn(email, password)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text>Log In Screen</Text>
          <TextInput 
          style={{marginTop: '5%', fontSize: 20, width: '80%', borderBottomWidth: 1}}
          placeholder='Email' 
          keyboardType='email-address'
          onChangeText={cEmail}
          value={email}
          />
          <TextInput 
          style={{marginTop: '5%', marginBottom: '5%', fontSize: 20, width: '80%', borderBottomWidth: 1}}
          placeholder='Password' 
          secureTextEntry={true}
          onChangeText={cPassword}
          value={password}
          />

          <Button title="Sign In" onPress={() => handleLogIn()}/>

          <Text style={{marginTop: '30%'}}>Don't have an account?</Text>
          <Button title="Sign Up" onPress={() => navigation.replace('SignUp')}/>
      </View>
    </TouchableWithoutFeedback>
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
