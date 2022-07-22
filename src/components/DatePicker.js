import React, {useState,Component} from 'react';
import {View, Button, Platform,Text,TouchableOpacity,Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import Foundation from 'react-native-vector-icons/Foundation'
import firebase from 'firebase'

export default class DatePicker extends Component {
    constructor(props){
    super(props)

    this.state = {
      date: this.props.data,
      show:false,//show calendar
      showTime:false//show time
    }
}
 onChange = (event, selectedDate) => {//when date is selected
  
    const currentDate = selectedDate || this.state.date;
    this.setState({date:currentDate})
    
    if(event.type=='set'){
        this.setState({showTime:true})
    }
    this.setState({show:false})
  };
  onChangeTime=(event, selectedDate)=> {//when time is selected
   const currentDate = selectedDate || this.state.date;
   
   if(event.type=='set'){
    this.setState({date:currentDate})
    const reservation=moment(this.state.date).format('D M YYYY HH:mm')
    const date=moment(this.state.date).format('D M YYYY')
    const hour=moment(this.state.date).format('HH:mm')
    const address=this.props.address
    firebase.firestore().collection('reservations').add({date:date,hour:hour,email:this.props.user.email,parking:this.props.markerName})
    .catch((error)=>{
      Alert.alert('','An error has occurred. Please try again later')

    })
    Alert.alert('','The reservation was successfully made for the date'+' '+date+' '+'and time'+' '+hour+"\n"+'Parking street is'+' '+address)
   }
   
   
   this.setState({showTime:false})
   this.setState({show:false})

 };
  showTimepicker(){//check if user is logged in
    if(this.props.user==undefined||this.props.user==null){
      Alert.alert('','Please log in to make a reservation')
  
    }
     else{ this.setState({show:true})}
  }
    render() {
      const { date } = this.state;
      return (
          <View>
               <View>
                <TouchableOpacity onPress={()=>this.showTimepicker()} style={{backgroundColor: '#545BE1',  paddingTop:'5%',marginTop:'5%',
                justifyContent: 'center', borderRadius: 10, width:this.props.width,height:50}}>
                <Foundation name="calendar"  backgroundColor="#FFF" color="#FFF" size={30} style={{alignSelf:'flex-end',paddingRight:'10%',paddingBottom:'10%'}}/>
                <Text style = {{color: '#FFF',position:'absolute',fontWeight:'bold',alignContent:'flex-start',paddingLeft:'9%',paddingBottom:'3%'}}>Make a reservation</Text></TouchableOpacity>
      </View>
      {this.state.show&& (
              <DateTimePicker 
                value={ date }
                mode='default'
                display='default'
                onChange={ this.onChange }
              />
         
          )}
          {this.state.showTime&&(
          <DateTimePicker 
            value={ date }
            mode='time'
            is24Hour={true}
            display='clock'
            onChange={ this.onChangeTime } 
          />)}
         </View>
      );
    }
  }