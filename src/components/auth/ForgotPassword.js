import { Button } from 'native-base'
import React, { Component } from 'react'
import { Text, View,StyleSheet,TextInput } from 'react-native'
import firebase from 'firebase'
import { Alert } from 'react-native';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };
class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            

        }

    }
    resetPassword(){
        firebase.auth().sendPasswordResetEmail(this.state.email)
        Alert.alert('','An email has been sent to your email account')

    }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <TextInput
                        placeholder="Email"
                        autoCapitalize="none"
                        onChangeText={(val) => this.setState({email:val})}
                        style={styles.textInput}
            />
            <Button color='#545BE1' 
                style={{width:300, height:70,borderRadius:5,justifyContent:'center',alignSelf:'center'}} 
                onPress={()=>this.resetPassword()}>
            <Text style={{fontWeight:'bold',color:'white', fontSize:15}}>Press here to change</Text></Button>           
      
      </View>
    )
  }
}

export default ForgotPassword
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#009387'
    },
    
    textInput: {
        fontSize:30,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });