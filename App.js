import {useState, useEffect} from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { manageUser } from './firebase';

///// SCREEN IMPORTS /////

import SignUp from './screens/userAuth/signUp';
import LogIn from './screens/userAuth/logIn';

import LoveHome from './screens/love/loveHome';
import LoveReceived from './screens/love/loveReceived';
import LoveQuotes from './screens/love/loveQuotes';

import Home from './screens/home';

import QuotesHome from './screens/quotes/quotesHome';
import { StrictMode } from 'react/cjs/react.production.min';

///////////////////////////

const LoveStack = createNativeStackNavigator();

function loveNav() {
  return (
      <LoveStack.Navigator screenOptions={{ headerShown: false }}>
        <LoveStack.Screen name="LoveHome" component={LoveHome} />
        <LoveStack.Screen name="LoveReceived" component={LoveReceived} />
        <LoveStack.Screen name="LoveQuotes" component={LoveQuotes} />
      </LoveStack.Navigator>
  )
}

const AuthStack = createNativeStackNavigator();

function auth() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='LogIn'>
      <AuthStack.Screen name="LogIn" component={LogIn}/>
      <AuthStack.Screen name="SignUp" component={SignUp}/>
    </AuthStack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

function main() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
      <Tab.Screen name="Home" component={Home} options={{gestureEnabled: false}}/>
      <Tab.Screen name="Love" component={loveNav} />
      <Tab.Screen name="Quotes" component={QuotesHome} />
    </Tab.Navigator>
  );
}

export default function App(){
  const userData = manageUser()
  return (
    <NavigationContainer>
      {userData ?
        main()
        :
        auth()
      }
    </NavigationContainer>
  )
}