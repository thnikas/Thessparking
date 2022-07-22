import React, { Component } from 'react'
import { View, Button, TextInput,StyleSheet,Text } from 'react-native'
import {Container,Header,Left,Right,Body,Icon } from 'native-base';
import {  withNavigationFocus } from 'react-navigation'
import * as Animatable from 'react-native-animatable';
import firebase from 'firebase'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign'
import RadioButton from '../RadioButton';
import { Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { TouchableOpacity } from 'react-native';
import Privacy from './Privacy'
import { createStackNavigator } from '@react-navigation/stack';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };
  if(firebase.apps.length==0){
      firebase.initializeApp(firebaseConfig)
  }
  const PROP = [
	{
		key: 'yes',
		text: 'Yes',
	},
	{
		key: 'no',
		text: 'No',
	},
	,
];
const selected=null
const Stack = createStackNavigator();

function MyStack() {
    return (
      <Stack.Navigator  screenOptions={{headerShown: false}}>
        <Stack.Screen   key="Privacy" name="Privacy" component={Privacy} />
        
      </Stack.Navigator>
    );
  }
export class Register extends Component {
    
    
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            username: '',
            confirm_password: '',
            check_textInputChange: false,
            check_emailInputChange:false,
            check_passInputChange:false,
            secureTextEntry: true,
            confirm_secureTextEntry: true,
            confirm_pass:false,
            isValid:true,
            setError:'',
            isOwner:false,
            value2: false,

        }

        this.onSignUp = this.onSignUp.bind(this)
    }
    textInputChange(val){//used to show the tick next to the username
    if(val.length!==0){
        this.setState({ username:val })
        if(val.length>5){
            this.setState({check_textInputChange:true})
        }else if(val.length<=5){
            this.setState({check_textInputChange:false})
        }
    }
    else {
        this.setState({username:val,check_textInputChange:false})
    }
    }
    EmailInputChange(val){//used to show the icon when the email is valid
    if(val.length!==0){
        this.setState({ email:val})
        if(this._isValidEmail(val)){
            this.setState({check_emailInputChange:true})
        }else{
            this.setState({check_emailInputChange:false})
        }
    }
    else{
        this.setState({name:val,check_emailInputChange:false})
    }
    }
    PassInputChange(password){//used to show when the password is acceptable
        if(password.length!==0){
            this.setState({ password:password })
            if(password.length>5){
                this.setState({check_passInputChange:true})
            }else{
                this.setState({check_passInputChange:false})
            }
        }
    }
    checkPass(pass){//used to check is the passwords match
        if(pass==this.state.password){
            this.setState({confirm_pass:true})
            this.setState({confirm_password:pass})
        }else{
            this.setState({confirm_pass:false})
            this.setState({confirm_password:pass})
        }
    }
    _isValidEmail(email){//used show that the email is valid
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(email) === false) {
            return false;
          }
          else{
              return true
          }
    }
    onSignUp() {//uses to signUp the user
        const { email, password, username,isOwner } = this.state;
        if(!email||!password||!username){//error if the user do not fill all the fields
            this.setState({setError:"Please fill in all fields"})
            this.setState({isValid:false})
            return

        }else if(username.length<6){//error if username length less than 6
            this.setState({setError:"Please try a longer username"})
            this.setState({isValid:false})
            return
        }else if(password!=this.state.confirm_password){//if passwords do not match
            this.setState({setError:"The passwords do not match"})
            this.setState({isValid:false})
            return
        }else if(password.length<6){
            this.setState({setError:"Please enter a stronger password"})
            this.setState({isValid:false})
            return
        }else if(!this._isValidEmail(email)){//if the email is valid
            this.setState({setError:"Please enter a valid E-mail"})
            this.setState({isValid:false})
            return
        }else if(this.state.value2==false){
            console.log('enter')
            this.setState({setError:"Please accept the privacy policy"})
           this.setState({isValid:false})
           return
        }
        if(global.Value=='no'){//used to pass in the database if the user is parking owner or not
            this.setState({isOwner:false})
         }else if(global.Value=='yes'){
             this.setState({isOwner:true})
         }
        this.setState({setError:""})
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set({
                    username,
                    email,
                    isOwner:this.state.isOwner
                })
                Alert.alert('','User created!')

            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    this.setState({setError:"These is already a user with the specific E-mail. Please try with another E-mail"})

                  }
                  if (error.code === 'auth/invalid-email') {
                    this.setState({setError:"Please register with a valid E-mail"})
                  }
                   
                
            })
    }
    
    componentDidUpdate(){
        
        
    }
    

    render() {  
        console.log(this.state.value2)
        
        return (
        <View style={ {flex: Platform.OS === 'ios' ? 3 : 5,backgroundColor: '#fff'}}>
           
            <Header style={{}}>
                <Left style={{ flexDirection: 'row' }}>
                <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: 'white', marginRight: 15 }} />
                </Left>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text style={{ color: 'white',fontWeight:'bold',fontSize:20,paddingRight:'30%' }} >Register</Text>
                </View>
                <Right>
                </Right>
            </Header>
            <Animatable.View style={{paddingTop:'5%'},styles.footer}animation="fadeInUpBig">
                  
                
                <View style={styles.action}>
                    <FontAwesome 
                        name="user-o"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        placeholder="Username"
                        autoCapitalize="none"
                        onChangeText={(val) => this.textInputChange(val)}
                        style={styles.textInput}
                    />
                    {this.state.check_textInputChange ? 
                        <Animatable.View
                            animation="bounceIn"
                        >
                            <Feather 
                                name="check-circle"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                    : null}
                </View>
                <View style={styles.action}>
                    <AntDesign 
                    style={{marginTop:'1%'}}
                    name="mail"  
                    color="#05375a"
                    size={20}/>
                    <TextInput
                        placeholder="E-mail"
                        autoCapitalize="none"
                        onChangeText={(val) => this.EmailInputChange(val)}
                        style={styles.textInput}
                        error={this.state.isValid}
                    />
                    {this.state.check_emailInputChange ? 
                        <Animatable.View
                            animation="bounceIn"
                        >
                            <Feather 
                                name="check-circle"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                    : null}
                </View>
                <View style={styles.action}> 
                    <FontAwesome 
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(password) =>{ this.PassInputChange(password),this.state.setError}}
                        style={styles.textInput}
                        error={this.state.isValid}
                    />
                    {this.state.check_passInputChange ? 
                    <Animatable.View
                        animation="bounceIn"
                    >
                        <Feather 
                            name="check-circle"
                            color="green"
                            size={20}
                        />
                    </Animatable.View>
                    : null}
                </View>
                <View style={styles.action}>
                    <FontAwesome 
                        name="lock"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        style={styles.textInput}
                        secureTextEntry={true}
                        placeholder="Confirm Password"
                        onChangeText={(pass)=>this.checkPass(pass)}
                    />
                     {this.state.confirm_pass ? 
                    <Animatable.View
                        animation="bounceIn"
                    >
                        <Feather 
                            name="check-circle"
                            color="green"
                            size={20}
                        />
                    </Animatable.View>
                    : null}
                </View>
             
                
                <View style={styles.action}>
                    <RadioButton PROP={PROP} value={PROP[0][0]} />
                </View>
                <View style={{paddingBottom:'10%'}}> 
                    <View style={{paddingLeft:'10%',paddingTop:'2%'}}>
                        <Text>I agree to the </Text>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate(Privacy)} style={{position:'absolute',paddingLeft:'41%',paddingTop:'2.5%',}}>
                        <Text style={{color:'#438CEC',fontWeight:'bold'}}>Terms of Use and Privacy Policy.</Text></TouchableOpacity>
                    </View>
                    
                    <View style={{position:'absolute'}}>
                        <CheckBox 
                            value={this.state.value2}
                            onValueChange={(value) =>
                                this.setState({
                                value2: value,
                                })
                            }
                            onAnimationDidStop={() => console.log('onAnimationDidStopEvent')}
                            lineWidth={2}
                            hideBox={false}
                            boxType={'circle'}
                            tintColors={'#9E663C'}
                            onCheckColor={'#6F763F'}
                            onFillColor={'#4DABEC'}
                            onTintColor={'#F4DCF8'}
                            animationDuration={0.5}
                            disabled={false}
                            onAnimationType={'bounce'}
                            offAnimationType={'stroke'}
                        />
                    </View>
                {this.state.setError ? (//show the errors
                    <View style={{color:'red',paddingTop:'10%'}}>
                        <Text style={{color:'red'}}>{this.state.setError}</Text>
                    </View>
                ) : null}
            </View>

                <Button
                    onPress={() => this.onSignUp()}
                    title="Register"
                    color='#545BE1'
                />
                
        </Animatable.View>
        </View>
        )
    }
}

export default (Register)
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
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
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