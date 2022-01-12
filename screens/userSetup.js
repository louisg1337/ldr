import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getData, storeData } from '../asyncStorage';
import { queryDatabase, signUserOut, updateDatabaseArray, retrieveDatabase, updateDatabase, deleteDatabaseField, addDatabase } from '../firebase';
import 'react-native-get-random-values'
import { customAlphabet } from 'nanoid'

export default function UserSetup({ navigation }) {
  const [loading, isLoading] = useState(true);
  const [user, setUser] = useState();
  const [id, setId] = useState();
  const [request, setRequest] = useState();

  useEffect(async () => {
    setTimeout(async () => {
      console.log('refreshed!')
      await getData('user').then(async (val) => {
        setUser(val)
        if (val.relationship) {
          console.log('Checked + found ASYNC')
          navigation.replace('Main')
          return;
        }
        await retrieveDatabase('users', val.id).then(async (snap) => {
          if (snap.relationship){
            console.log('Checked + found FIREBASE')
            await updateAsync(val)
            navigation.replace('Main')
            return;
          }
          setRequest(snap.request)
          isLoading(false)
        })
      })
    }, 500)
  }, [])

  // Search for user in database
  const search = async () => {
    await queryDatabase('users', 'relationshipID', id).then(async (val) => {
      if (val.length === 0){
        alert('User not found!')
      } else {
        if (val[0][0].relationshipID != user.relationshipID && !(val[0][0].relationship)){
          // Add to current user firebase
          await updateDatabaseArray('users', user.id, 'request', {name: val[0][0].displayName, type: 'S', relID: val[0][0].relationshipID, id: val[0][1]})
          // Add to other user firebase
          await updateDatabaseArray('users', val[0][1], 'request', {name: user.displayName, type: 'R', relID: user.relationshipID, id: user.id})
        } else {
          alert('User not available!')
        }
      }
    }).catch((e) =>{
      console.log(e)
    })
  }

  // Accept Request
  const acceptedRequest = async (index) => {
    // Add to firebase that relationship is true for both
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
    const newID = nanoid()
    await updateDatabase('users', user.id, 'relationship', newID);
    await updateDatabase('users', request[index].id, 'relationship', newID);

    // Create new relationship with both ID's in it
    const newRelationship = {
      userOne: [user.displayName, user.id], 
      userTwo: [request[index].name, request[index].id]
    }
    await addDatabase('relationships', newID, newRelationship)

    // Delete request from database
    await deleteDatabaseField('users', user.id, 'request')
    await deleteDatabaseField('users', request[index].id, 'request')

    // Update async
    await updateAsync(user)

    navigation.replace('Main')
    
  }

  const updateAsync = async (userInfo) => {
    console.log(userInfo)
    const newData = userInfo
    newData.relationship = true
    await storeData('user', newData);
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  } else {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        <View style={styles.container}>
          <Text style={{fontSize: 25}}>Welcome, request your partner!</Text>
          <Text style={{fontSize: 25,marginTop:'15%'}}>Your code is: {user.relationshipID}</Text>
          <Text style={{fontSize: 20}}>Request someone here!</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput 
            style={{marginTop: '5%', fontSize: 25, borderBottomWidth: 1, width: '75%'}}
            onChangeText={setId}
            value={id}
            placeholder='8 Char ID'
            maxLength={8}
            autoCapitalize='characters'
            autoCorrect={false}
            />
            <View style={{alignItems: 'center', borderWidth: 1}}>
              <Button title="Submit" style={{justifyContent: 'flex-end'}} onPress={() => search()}/>
            </View>
          </View>
          <View style={{borderWidth: 1, height: 300, width: '75%', marginTop: '10%', alignItems: 'center'}}>
            <Text>Requests show up here!</Text>
            { request &&
              request.map((val, index) => (
                <View style={{width: '80%', height: '15%', flexDirection: 'row', borderWidth: 1, marginTop: '5%'}} key={index}>
                  <View style={{width: '70%', height: '100%', justifyContent: 'center'}}>
                    <Text style={{fontSize: 20, paddingLeft: 5}}>{val.name}, {val.type}</Text>
                  </View>
                  {val.type == 'R' &&
                    <View style={{width: '30%', height: '100%'}}>
                      <Button title='Yes' onPress={() => {acceptedRequest(index)}}/>
                    </View> 
                  }
                </View>
              ))
            }
          </View>
          <Button title="Sign Out" onPress={() => signUserOut()}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
