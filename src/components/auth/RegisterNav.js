import React, { Component } from 'react';
import {View,Text ,ScrollView} from 'react-native';
import {Container} from 'native-base';
import Register from './Register'
import Privacy from './Privacy';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator  screenOptions={{headerShown: false}}>
      <Stack.Screen   key="Register" name="Register" component={Register} />
      <Stack.Screen name="Privacy" key="Privacy" component={Privacy} />
    </Stack.Navigator>
  );
}
class RegisterNav extends React.Component{
   render(){
    
      return(
            
            <MyStack/>
        
     );
   }
}

export default (RegisterNav);