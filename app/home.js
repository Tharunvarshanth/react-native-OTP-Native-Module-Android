import React,{useState,useRef, useEffect} from 'react';
import {
    
    StyleSheet, Button,
    Text,
    useColorScheme,
    View, Picker, TouchableOpacity, TextInput,NativeModules,NativeEventEmitter,ActivityIndicator
  } from 'react-native';


const { CalendarModule } = NativeModules;

const RESEND_OTP_TIME_LIMIT = 30; // 30 secs
const AUTO_SUBMIT_OTP_TIME_LIMIT = 4; // 4 secs

let resendOtpTimerInterval;
let autoSubmitOtpTimerInterval;
function HomeScreen({ navigation }) {

  const [otpArray, setOtpArray] = useState(['', '', '', '','','']);

  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);
  const fifthTextInputRef = useRef(null);
  const sixthTextInputRef  = useRef(null);

  // in secs, if value is greater than 0 then button will be disabled
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );

  // 0 < autoSubmitOtpTime < 4 to show auto submitting OTP text
  const [autoSubmitOtpTime, setAutoSubmitOtpTime] = useState(
        AUTO_SUBMIT_OTP_TIME_LIMIT,
 );
 
 // a reference to autoSubmitOtpTimerIntervalCallback to always get updated value of autoSubmitOtpTime
  const autoSubmitOtpTimerIntervalCallbackReference = useRef();
  
  useEffect(() => {
    // autoSubmitOtpTime value will be set after otp is detected,
    // in that case we have to start auto submit timer
    autoSubmitOtpTimerIntervalCallbackReference.current = autoSubmitOtpTimerIntervalCallback;
  });

  const [submittingOtp, setSubmittingOtp] = useState(false);
  
   useEffect(() => {
    if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
      resendOtpTimerInterval = setInterval(() => {
        if (resendButtonDisabledTime <= 0) {
          clearInterval(resendOtpTimerInterval);
        } else {
          setResendButtonDisabledTime(resendButtonDisabledTime - 1);
        }
      }, 1000);

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  const startAutoSubmitOtpTimer = () => {
      if(autoSubmitOtpTimerInterval){
          clearInterval(autoSubmitOtpTimerInterval);
      }
      autoSubmitOtpTimerInterval = setInterval(() => {
        autoSubmitOtpTimerIntervalCallbackReference.current();
      }, 1000);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
      resendOtpTimerInterval = setInterval(() => {
        if (resendButtonDisabledTime <= 0) {
          clearInterval(resendOtpTimerInterval);
        } else {
          setResendButtonDisabledTime(resendButtonDisabledTime - 1);
        }
      }, 1000);
 };

  // this callback is being invoked from startAutoSubmitOtpTimer which itself is being invoked from useEffect
  // since useEffect use closure to cache variables data, we will not be able to get updated autoSubmitOtpTime value
  // as a solution we are using useRef by keeping its value always updated inside useEffect(componentDidUpdate)
const autoSubmitOtpTimerIntervalCallback = () =>{
     if(autoSubmitOtpTime <= 0){
         clearInterval(autoSubmitOtpTimerInterval);

         // submit OTP
        onSubmitButtonPress();
     }
     console.log(autoSubmitOtpTime)
     setAutoSubmitOtpTime(autoSubmitOtpTime - 1);
}

useEffect(() => {
    startResendOtpTimer();
    return () => {
        if (resendOtpTimerInterval) {
            clearTimeout(resendOtpTimerInterval);
        }
    };
}, [resendButtonDisabledTime, startResendOtpTimer]);
  
useEffect(() => {
    // autoSubmitOtpTime value will be set after otp is detected,
    // in that case we have to start auto submit timer
    autoSubmitOtpTimerIntervalCallbackReference.current = autoSubmitOtpTimerIntervalCallback;
  });


  const onOptionOtp = (index) =>{
    return (value) => {
        if (isNaN(value)){
            return;
        }
        const otpArrayCpy = otpArray.concat();
            otpArrayCpy[index] = value;
            setOtpArray(otpArrayCpy);
            if (value !== '') {
                if (index === 0) {
                    firstTextInputRef.current.focus();
                } else if (index === 1) {
                    secondTextInputRef.current.focus();
                } else if (index === 2) {
                    thirdTextInputRef.current.focus();
                }else if(index === 3){
                    fourthTextInputRef.current.focus();
                } else if (index === 4){
                    fifthTextInputRef.current.focus();
                }else if(index ===5){
                    sixthTextInputRef.current.focus()
                }
            }
    }
    };


  useEffect(()=>{
    CalendarModule.createCalendarEvent('testName', 'testLocation');

    const eventEmitter = new NativeEventEmitter(CalendarModule);
    const  eventListener = eventEmitter.addListener('EventReminder', (event) => {
            if (event !== null){
              var num =  /(\d{6})/.exec(event.eventProperty)[1];
              var digits = num.toString().split('');
              setOtpArray(digits);
              setAutoSubmitOtpTime(AUTO_SUBMIT_OTP_TIME_LIMIT);
              startAutoSubmitOtpTimer();
            }
          });

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


    return () => {
     // RNOtpVerify.removeListener();
      eventListener?.remove();
    };
  },[otpArray]);

  

  const onResendOtpButtonPress = () => {
    // clear last OTP
    if (firstTextInputRef) {
      setOtpArray(['', '', '', '','','']);
      firstTextInputRef.current.focus();
    }

    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();

    // resend OTP Api call
    // todo
    console.log('todo: Resend OTP');
  };
  const onSubmitButtonPress = () => {
    setSubmittingOtp(true)
    // API call
    // todo
    console.log('todo: Submit OTP');
  };

  return (
      <View style={{flex:1}}>
        <View style={{flex:1,flexDirection:'column',justifyContent:'space-around'}}> 
            <Text>Enter OTP </Text>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
             {[
               firstTextInputRef,
               secondTextInputRef,
               thirdTextInputRef,
               fourthTextInputRef,
               fifthTextInputRef,
               sixthTextInputRef
              ].map((element,index)=>(
              <TextInput
                 style={styles.numberInput}
                 textContentType="oneTimeCode"
                 key={index}
                 autoFocus={index===0? true:undefined}
                 maxLength={1}
                 keyboardType='numeric'
                 onChangeText={onOptionOtp(index) }
                 value={otpArray[index]}
                 ref={element}
              />
              ))}
           </View>
           <Button title="Verify"  onPress={onSubmitButtonPress} />
        </View>
        {submittingOtp && <ActivityIndicator />}
        <View style={{flex:1,flexDirection:'column',justifyContent:'space-around'}}>
            <Text>Time left : {resendButtonDisabledTime}</Text>
            <Button title="Resend Otp" onPress={onResendOtpButtonPress} />
        </View>
      </View>
  );
}


const styles = StyleSheet.create({
    numberInput:{
        height:40,
        borderColor:'#0000FF',
        borderWidth: 2
    }
})

export default HomeScreen;