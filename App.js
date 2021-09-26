/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState,useRef, useEffect} from 'react';
import { 
  StyleSheet, 
  Button,
  Text,  
  View, TextInput,NativeModules,NativeEventEmitter,
} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/home';
import DetailsScreen from './app/details';
const { CalendarModule } = NativeModules;

const Stack = createNativeStackNavigator();

const App = ({navigation}) => {


  useEffect(()=>{


/*
    RNOtpVerify.getOtp()
    .then(p=>{
        RNOtpVerify.addListener(message=>{
       try{
         if(message){
           console.log("otp message from server",message)
           const messageArray = message.split('\n');
           if(messageArray[2]){
             const otp = messageArray[2].split(' ')[0];
             if (otp.length === 4) {
              setOtpArray(otp.split(''));

              // to auto submit otp in 4 secs
              //setAutoSubmitOtpTime(AUTO_SUBMIT_OTP_TIME_LIMIT);
              //startAutoSubmitOtpTimer();
            }
           }
         }
       }catch(error){
         console.log("error",error);
       }
    });
  })
  .catch(error =>{
    console.log("error",error);
  });*/


});

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Details">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  );
};


export default App;
