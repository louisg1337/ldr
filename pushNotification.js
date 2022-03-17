import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { storeData } from './asyncStorage'
import { updateDatabaseArray } from './firebase';

// Load into home screen, check if there is an expo token
// 1. Expo token, don't run register
// 2. No expo token, run register, save to async, add to firebase



export const registerForPushNotificationsAsync = async (user, relationship) => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      // FOUND TOKEN
      await storeData('token', token)
      // Find correct user in relationship
      if (relationship.userOne.includes(user.id)) {
        console.log('user one!')
        await updateDatabaseArray('relationships', user.relationship, 'userOne', token)
      } else {
        console.log('user two!')
        await updateDatabaseArray('relationships', user.relationship, 'userTwo', token)
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };