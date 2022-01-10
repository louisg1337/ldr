import { StatusBar } from 'expo-status-bar';
import { useState } from 'react'
import { StyleSheet, Text, View, Button, TextInput, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { signUp } from '../../firebase';



export default function SignUp({ navigation }) {
  const [email, cEmail] = useState('')
  const [password, cPassword] = useState('')
  const [name, cName] = useState('')


  const handleSignUp = async () => {
    console.log('attempting to sign in')
    try {
      await signUp(email, password, name)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text>Sign Up Screen</Text>
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
        <TextInput 
        style={{fontSize: 20, width: '80%', borderBottomWidth: 1}}
        placeholder='Name' 
        onChangeText={cName}
        value={name}
        />

        <Button title="Sign Up" onPress={() => handleSignUp()}/>
        <Text style={{marginTop: '30%'}}>Have an account?</Text>
        <Button title="Sign In" onPress={() => navigation.navigate('LogIn')}/>
        <StatusBar style="auto" />
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
