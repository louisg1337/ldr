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
  const [refresh, setRefresh] = useState(true);

  useEffect(async () => {
    setTimeout(async () => {
      // Get async storage data on user
      await getData('user').then(async (val) => {
        setUser(val)
        console.log('///// USER SETUP //////')
        console.log(val)
        if (val.relationship) {
          console.log('Checked + foun  d ASYNC')
          navigation.replace('Main')
          return;
        }
        // Get requests from firebase
        await retrieveDatabase('users', val.id).then(async (snap) => {
          if (snap.relationship){
            console.log('Checked + found FIREBASE')
            let newData = val
            newData['relationship'] = snap.relationship
            console.log(newData)
            await storeData('user', val);
            // navigation.replace('Main')
            return;
          }
          setRequest(snap.request)
          setTimeout(() => {isLoading(false)}, 300);
        })
      })
    }, 500)
  }, [refresh])

  // Search for user in database, if found add to each users' requests
  const search = async () => {
    await queryDatabase('users', 'relationshipID', id).then(async (val) => {
      if (val.length === 0){
        alert('User not found!')
      } else {
        if (val[0][0].relationshipID != user.relationshipID && !(val[0][0].relationship)){
          await updateDatabaseArray('users', user.id, 'request', {name: val[0][0].displayName, type: 'S', relID: val[0][0].relationshipID, id: val[0][1]})
          await updateDatabaseArray('users', val[0][1], 'request', {name: user.displayName, type: 'R', relID: user.relationshipID, id: user.id})
          setRefresh(!refresh)
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

    // Update async
    let newData = user
    newData['relationship'] = newID
    await storeData('user', newData);

    // Create new relationship with both ID's + names in it
    const newRelationship = {
      userOne: [user.displayName, user.id], 
      userTwo: [request[index].name, request[index].id]
    }
    await addDatabase('relationships', newID, newRelationship)

    // Delete request from database
    await deleteDatabaseField('users', user.id, 'request')
    await deleteDatabaseField('users', request[index].id, 'request')


    navigation.replace('Main')
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
          <Button title="Refresh" onPress={() => setRefresh(!refresh)}/>
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
