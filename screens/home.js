import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Modal, Pressable, TouchableWithoutFeedback, TextInput, Keyboard, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { useEffect, useState } from 'react'
import { useFonts } from 'expo-font';
import { signUserOut, retrieveDatabase, updateDatabase } from '../firebase';
import { getData, storeData } from '../asyncStorage';
import { registerForPushNotificationsAsync } from '../pushNotification';

export default function Home({ navigation }) {
  const [loading, isLoading] = useState(true);
  const [user, setUser] = useState();
  const [relationship, setRelationship] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);
  const [refresh, setRefresh] = useState(true)
 
  useEffect(() => {
    console.log('////////////// HOME SCREEN ////////////////')
    initData().then(() => isLoading(false))

  }, [])

  useEffect(() => {
    const unsub = navigation.addListener('blur', async () => {
      console.log('blurred!')
      console.log('//////////////////////')
      blurred(date, relationship)
    })

    return () => unsub
  }, [navigation, date])

  useEffect(() => {
    countdown()
    let timer = setTimeout(() => {setRefresh(!refresh)}, 1000)
    return () => { clearTimeout(timer) }
  }, [refresh])

  // Add timer data to database + async when blurred
  const blurred = async (d, r) => {
    console.log(r)
    // if ((d === false && r.date === false) || d === r.date) {
    //   console.log('No change to timer!')
    // } else {
    //   let newRel = r
    //   newRel['date'] = d
    //   setRelationship(newRel)
    //   await storeData('relationship', newRel)
    //   await updateDatabase('relationships', user.relationship, 'date', d)
    // }
  }

  // Load in fonts
  let [fontsLoaded] = useFonts({
    'Roboto': require('../assets/fonts/Roboto-Light.ttf')
  })

  // Gather and save data (firebase + async storage) once user logged into app
  const initData = async () => {
    await getData('user').then((snap) => {
      setUser(snap);
      retrieveDatabase('relationships', snap.relationship).then((rel) => {
        setRelationship(rel)
        storeData('relationship', rel)
        if (typeof rel.date !== 'undefined'){
          console.log('Found date!')
          setDate(rel.date)
        } else {
          let temp = rel
          temp['date'] = false
          setRelationship(temp)
          setDate(false)
        }
        // if user does not have expo token, 

        // registerForPushNotificationsAsync(snap, relationship)
      }).catch(e => console.log(e))
    }).catch((e) => console.log(e))
  }

  // Logic for countdown
  const countdown = () => {
    const meet = new Date(date[0], date[1], date[2]).getTime()
    const currentDate = new Date().getTime()
    const diff = (meet - currentDate)
    if (!date || diff < 0) {
      // if date false, aka not found, set time to 0
      setSeconds(0);
      setMinutes(0);
      setHours(0);
      setDays(0);
      return;
    }
    const second = Math.floor(diff / 1000)
    setSeconds(second % 60)
    const minute = Math.floor(diff / (1000 * 60))
    setMinutes(minute % 60)
    const hour = Math.floor(diff / (1000 * 60 * 60))
    setHours(hour % 24)
    const day = Math.floor(diff / (1000 * 60 * 60 * 24))
    setDays(day)
  }

  // Handle changing date
  const finished = async (day, month, year) => {
    const current = new Date().getTime()
    const test = new Date(year, month - 1, day).getTime()
    if (day == '' && month == '' && year == ''){ 
      setModalVisible(!modalVisible)
      return
    } else if (test <= current) {
      alert('Please enter a valid date!')
      return
    }
    // MONTH IS -1
    setDate([year, month-1, day])
    setModalVisible(!modalVisible)
  }

  ///////// TESTING FUNCTIONS /////////
  const handleSignOut = async () => {
    try {
      await signUserOut()
    } catch (error) {
      alert(error)
    }
  }

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <ModalComponent current={date} finished={finished}/>
        </Modal>
        <View style={styles.countdownContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.dayText}>{days < 10 ? '0' + days : days}</Text>
            <View style={styles.innerBigText}>
              <Text style={[styles.reprText, {fontSize: Dimensions.get('window').height * 0.04}]}>D</Text>
            </View>  
          </View>
          <View style={styles.timeContainer}>
            <View style={styles.innerTimeContainer}>
              <Text style={styles.normalText}>{hours < 10 ? '0' + hours : hours}</Text>
              <View style={styles.innerText}>
                <Text style={styles.reprText}>H</Text>
              </View>  
            </View>
            <View style={styles.innerTimeContainer}>
              <Text style={styles.normalText}>{minutes < 10 ? '0' + minutes : minutes}</Text>
                <View style={styles.innerText}>
                  <Text style={styles.reprText}>M</Text>
                </View>  
            </View>
            <View style={styles.innerTimeContainer}>
              <Text style={styles.normalText}>{seconds < 10 ? '0' + seconds : seconds}</Text>
              <View style={styles.innerText}>
                  <Text style={styles.reprText}>S</Text>
                </View>  
            </View>
          </View>
        </View>
        <Text style={styles.motivationText}>The wait is worth it {user.displayName}!</Text>
        <Pressable style={styles.toggleButton} onPress={() => setModalVisible(!modalVisible)}>
          <FontAwesomeIcon icon={faClock} size={40}/>
        </Pressable>
        <View style={{flexDirection: 'row', position: 'absolute', bottom: 10}}>
          <Button title="Sign Out" onPress={() => handleSignOut()}/>
          <Button title="Retrieve" onPress={() => test()}/>
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }
}


const ModalComponent = ({ current, finished }) => {
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();

  useEffect(() => {
    if (!current) {
      setDay('')
      setMonth('')
      setYear('')
    } else {
      setDay(current[2].toString())
      setMonth((current[1] + 1).toString())
      setYear(current[0].toString())
    }
  }, [])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalInnerContainer}>
              <Text style={{fontSize: 20}}>Countdown Date</Text>
              <View style={styles.modalDateContainer}>
                <TextInput 
                placeholder='mo' 
                textAlign='center' 
                keyboardType='numeric' 
                placeholderTextColor='#949494'
                maxLength={2}
                value={month}
                onChangeText={setMonth}
                style={styles.modalDateInputShort}
                />
                <Text style={styles.modalDateSlash}>/</Text>
                <TextInput 
                placeholder='dy' 
                textAlign='center' 
                keyboardType='numeric' 
                placeholderTextColor='#949494'
                maxLength={2}
                value={day}
                onChangeText={setDay}
                style={styles.modalDateInputShort}
                />
                <Text style={styles.modalDateSlash}>/</Text>
                <TextInput 
                placeholder='year' 
                textAlign='center' 
                keyboardType='numeric' 
                placeholderTextColor='#949494'
                maxLength={4}
                value={year}
                onChangeText={setYear}
                style={styles.modalDateInputLong}
                />    
              </View>
            </View>
            <View style={styles.modalButtonContainer}>
              <Pressable 
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? 'rgb(210, 230, 255)'
                    : 'white'
                },
                styles.modalButton
              ]} 
              onPress={() => finished(day, month, year)}>
                <Text style={{fontSize: 20}}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  motivationText: {
    fontFamily: 'Roboto',
    fontSize: Dimensions.get('window').height * 0.025,
    marginTop: '2%'
  },


  ///////////////
  // COUNTDOWN //
  ///////////////

  timeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerTimeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  countdownContainer: {
    width: '80%',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: '5%',
    paddingRight: '4%'
  },
  dayText: {
    fontSize: Dimensions.get('window').height * 0.13,
    fontFamily: 'Roboto'
  },
  normalText: {
    fontSize: Dimensions.get('window').height * 0.07,
    fontFamily: 'Roboto'
  },
  reprText: {
    fontSize: Dimensions.get('window').height * 0.025,
    fontFamily: 'Roboto',
    textAlign: 'center'
  },
  innerText: {
    justifyContent: 'flex-end',
    marginBottom: '8%',
    position: 'absolute',
    bottom: '1.5%',
    right: '-5%',
    fontFamily: 'Roboto'
  },
  innerBigText: {
    justifyContent: 'flex-end',
    marginBottom: '8%',
    position: 'absolute',
    bottom: '-4%',
    right: '-7%',
    fontFamily: 'Roboto'
  },
  toggleButton: {
    borderWidth: 3,
    padding: 10,
    borderRadius: 40,
    position: 'absolute',
    top: 40,
    left: 10,
  },

  ///////////
  // MODAL //
  ///////////

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    width: '70%',
    height: '30%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: '4%',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalInnerContainer: {
    flex: 5,
    width: '100%',
  },
  modalDateContainer: {
    width: '100%',
    height: '40%',
    marginTop: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalDateInputShort: {
    borderBottomWidth: 1,
    width: '15%',
    fontSize: 25,
    paddingBottom: '1%',
    color: 'black'
  },
  modalDateInputLong: {
    borderBottomWidth: 1,
    width: '25%',
    fontSize: 25,
    paddingBottom: '1%',
    color: 'black'
  },
  modalDateSlash: {
    fontSize: 40,
    marginLeft: '8%',
    marginRight: '8%'
  },
  modalButtonContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalButton: {
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: '14%',
    paddingRight: '14%',
    paddingTop: '3%',
    paddingBottom: '3%'
  }
});
