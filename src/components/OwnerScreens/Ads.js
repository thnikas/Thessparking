import React, { Component,PureComponent } from 'react';
import {StyleSheet,BackHandler, Alert,View,Dimensions,ScrollView,Image,Button,Touchable,TouchableOpacity,TouchableHighlight,TextInput,SafeAreaView,Animated,Keyboard,TouchableWithoutFeedback} from 'react-native';
import {Container,Header,Left,Right,Icon,Text,Body } from 'native-base';
import firebase  from 'firebase';
import { createStackNavigator, } from '@react-navigation/stack';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType, RewardedAd, RewardedAdEventType } from '@react-native-firebase/admob';
import InfoIcon from 'react-native-vector-icons/FontAwesome5'
import Database from '../../data/Data'
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
  }
  firebase.firestore().settings({ experimentalForceLongPolling: true });//fixed firestore bug

  _isMounted=false//used so that mounted error do not shows

const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();


class Ads extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            back:false,
        }}
        backAction = () => {
          Alert.alert("Hold on!", "Are you sure you want to go back?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () =>   this.props.navigation.goBack()
          }
          ]);
          return true;
        };
      
        
      
        showInterstitialAd = () => {
          // Create a new instance
          const interstitialAd = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);
        
          // Add event handlers
          interstitialAd.onAdEvent((type, error) => {
            if (type === AdEventType.LOADED) {
              interstitialAd.show();
            }
          });
        
          // Load a new advert
          interstitialAd.load();
        }
      
        showRewardAd = () => {
              // Create a new instance
              const rewardAd = RewardedAd.createForAdRequest(TestIds.REWARDED);
      
              // Add event handlers
              rewardAd.onAdEvent((type, error) => {
                  if (type === RewardedAdEventType.LOADED) {
                      rewardAd.show();
                  }
      
                  if (type === RewardedAdEventType.EARNED_REWARD) {
                      console.log('User earned reward of 5 lives');
                      Alert.alert(
                          'Reward Ad',
                          'You just earned a reward of 5 lives',
                          [
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                          ],
                          { cancelable: true }
                        )
                  }
              });
      
              // Load a new advert
              rewardAd.load();
          }
  render() {
    
  return(
    
    
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }} >
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ marginVertical: 20 }} >
      <View style={styles.contentContainer} >
        
        <Text style={styles.header} >Banner Ads</Text>
        <View style={styles.divider} />

        <View style={styles.infoBox} >
          <Text style={styles.infoText} >
          Banner Ads are usually placed at the bottom of the app.
          You can choose where on the screen you want it to appear.
          You can also place multiple Banners on the application screen.
          </Text>
        </View>
      </View>
      
      <View>
        <BannerAd
        
          unitId={TestIds.BANNER}
          size={BannerAdSize.SMART_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true
          }}
          onAdLoaded={() => console.log('Advert loaded')}
          onAdFailedToLoad={(error) => {
            console.error('Advert failed to load: ', error)
          }}
        />
      </View>
      
      <View style={styles.contentContainer} >
        <Text style={styles.header} >Interstitial Ads</Text>
        <View style={styles.divider} />

        <View style={styles.infoBox} >
          <Text style={styles.infoText} >
          Interstitial ads cover the entire application screen. You are given the opportunity to quote
          more information about your Parking.
            </Text>
        </View>

        <View>
          <TouchableOpacity style={styles.btnStyle} onPress={this.showInterstitialAd} >
            <Text style={styles.btnText}>Press Here</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.contentContainer} >
        <Text style={styles.header} >Reward Ads</Text>
        <View style={styles.divider} />

        <View style={styles.infoBox} >
          <Text style={styles.infoText} >
          Reward Ads are similar to interstitial ads just after a few seconds
          the user is given the option to close the ad.
          </Text>
        </View>

        <View>
          <TouchableOpacity style={styles.btnStyle} onPress={this.showRewardAd} >
            <Text style={styles.btnText} >Press Here</Text>
          </TouchableOpacity>
        </View>
        <View><InfoIcon name='info' size={30} style={{position:'absolute'}}/>
        <Text style={{paddingLeft:'10%',paddingBottom:'5%'}}>To create your own publicity
        contact email: </Text><Text style={{paddingLeft:'10%',paddingBottom:'5%',fontSize:20,color:'#545BE1'}}>infoThessParking@gmail.com</Text>
        </View>
        
      </View>
        
    </ScrollView>

  </SafeAreaView>
)}
    
  
}
export default Ads;

const styles = StyleSheet.create({
	contentContainer: {
		margin: 20 
	},
	header: {
		fontWeight: 'bold',
		fontSize: 30
	},
	divider: {
		width: '100%',
		height: 2, 
		backgroundColor: '#000',
		marginBottom: 20
	},
	infoBox: {
		backgroundColor: '#fff',
		borderRadius: 20, 
		elevation: 5,
		marginHorizontal: 5,
		paddingHorizontal: 10,
		paddingVertical: 15
	},
	infoText: {
		fontSize: 15
	},
	btnStyle: {
		marginVertical: 20,
		borderRadius: 20,
		paddingHorizontal: 20,
		paddingVertical: 7,
		backgroundColor: '#0bc4d9'
	},
	btnText: {
		fontSize: 20,
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'center',
		elevation: 5
	}
})