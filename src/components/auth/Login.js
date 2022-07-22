import React, { Component } from 'react'
import { View, Button, TextInput,Text,StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import firebase from 'firebase'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import {Container,Header,Left,Right,Body,Icon } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, } from '@react-navigation/stack';
import { Alert } from 'react-native';
import {  withNavigationFocus } from 'react-navigation'

const Stack = createStackNavigator();


export class Login extends Component {
    
     App() {
       
      }
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            setError:'',
            move:false,
            forgot:false,
        }

        this.onSignUp = this.onSignUp.bind(this)
    }
   
    _isValidEmail(email){
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(email) === false) {
            return false;
          }
          else{
              return true
          }
    }
    onSignUp() {
        const { email, password } = this.state;
        if(!email||!password){
            this.setState({setError:"Please fill in all fields"})
            return

        }else if(!this._isValidEmail(email)){
            this.setState({setError:"Please enter a valid E-mail"})
            return
        }
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                this.setState({setError:null})
                Alert.alert('','Welcome!')

            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    this.setState({setError:"This e-mail does not exist. Please try again with another one"})

                  }
                  if (error.code === 'auth/wrong-password') {
                    this.setState({setError:"The password is incorrect"})
                  }
            })
    }

   componentDidMount(){

   }
    render() {
       
      
        if(this.state.move==false){
            return (
                <View style={ {flex: Platform.OS === 'ios' ? 3 : 5,backgroundColor: '#fff'}}>
                    <Header>
                        <Left style={{ flexDirection: 'row' }}>
                        <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: 'white', marginRight: 15 }} />
                        </Left>
                        <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text style={{ color: 'white',fontWeight:'bold',fontSize:20,paddingRight:'30%' }} >Log in</Text>
                        </View>
                        <Right>
                        </Right>
                    </Header>
                
                    <Animatable.View style={{paddingTop:'5%'}, styles.footer}animation="fadeInUpBig">
                        <View style={styles.action}>
                            <AntDesign 
                                style={{marginTop:'1%'}}
                                name="mail"  
                                color="#05375a"
                                size={20}/>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="E-mail"
                                    onChangeText={(email) => this.setState({ email })}
                                    autoCapitalize='none'
                                />
                        </View>
                        <View style={styles.action}>
                            <FontAwesome 
                                    name="lock"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    onChangeText={(password) => this.setState({ password })}
                                />
                        </View>
                        
                        {this.state.setError ? (
                            <View style={{color:'red'}}>
                            <Text style={{color:'red'}}>{this.state.setError}</Text>
                            </View>
                        ) : null}
                        <Button
                            onPress={() => this.onSignUp()}
                            title="Log in "
                            color='#545BE1'
                        />
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('ForgotPassword')} style={{paddingTop:'4%'}}><Text style={{fontSize:15,color:'#F98A29'}}>Did you forget your password?</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('RegisterNav')} style={{paddingTop:'4%'}}><Text style={{fontSize:15,color:'#0E9FFF'}}>You do not have an account? Click here to create an account</Text></TouchableOpacity>
                    </Animatable.View>
                </View>
            )
        }
       
    }
}

export default (Login)
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
})