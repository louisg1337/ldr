import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react'

export const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
      console.log('Successfully stored')
    } catch (e) {
        console.log('Store Data Failure')
        console.log(e)
    }
}

export const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log('Get Data Failure')
      console.log(e)
    }
  }

export const trackRelationship = async () => {
    const [currentRel, setCurrentRel] = useState();
    useEffect(() => {
        const unsub = getData('user').then(val => setCurrentRel(val.relationship))
        return unsub;
    }, []);
    
    return currentRel;
}