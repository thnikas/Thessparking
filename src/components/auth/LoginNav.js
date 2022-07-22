import React, { Component } from 'react';
import {View,Text ,ScrollView} from 'react-native';
import {Container} from 'native-base';
import RegisterNav from './RegisterNav'
import Privacy from './Privacy';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator  screenOptions={{headerShown: false}}>
      <Stack.Screen   key="Login" name="Login" component={Login} />
      <Stack.Screen name="RegisterNav" key="RegisterNav" component={RegisterNav} />
      <Stack.Screen name="ForgotPassword" key="ForgotPassword" component={ForgotPassword} />

    </Stack.Navigator>
  );
}
class LoginNav extends React.Component{
   render(){
    
      return(
            
            <MyStack/>
        
     );
   }
}

export default (LoginNav);