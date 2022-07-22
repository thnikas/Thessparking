import { Button } from 'native-base'
import React from 'react'
import {StyleSheet,TouchableOpacity,Image,Text,View} from 'react-native'
import MyView from './MyView'
export default class Card extends React.PureComponent {
    render() {
        return (
            <MyView hide={this.state.props.isHidden}>
            <Animated.ScrollView
              horizontal
              scrollEventThrottle={1}
              showsHorizontalScrollIndicator={false}
              snapToInterval={props.CARD_WIDTH}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: this.props.animation,
                        
                      },
                    },
                  },
                ],
                { useNativeDriver: true }
              )}
              style={styles.scrollView}
              contentContainerStyle={styles.endPadding}
            >
            {
              this.state.props.data.map((marker, index) => (
                <View style={styles.card} key={index}>
                  
                  <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>
                      {marker.Name}
                    </Text>
                    <Button>
                      <Text>Insctuctions</Text>
                    </Button>
                  </View>
                </View>
              ))
            }
            </Animated.ScrollView>
          </MyView>    
            
        )
    }
}

const styles = StyleSheet.create({
    //searchBar
     searchBox: {
       position:'absolute', 
       marginTop: '15%',
       flexDirection:"row",
       backgroundColor: '#fff',
       width: '90%',
       alignSelf:'center',
       borderRadius: 5,
       padding: 5,
       
       shadowColor: '#ccc',
       shadowOffset: { width: 0, height: 3 },
       shadowOpacity: 0.5,
       shadowRadius: 5,
       elevation: 10,
     },
      map: {
        position:'relative',
       width: 400,
       height: 800,
      },  
      
     
     container: {
       flex: 1,
       
     },
     cardView:{
       position:'absolute', 
      
       
       
       },scrollView: {
         position: "absolute",
         bottom: 30,
         left: 0,
         right: 0,
         paddingVertical: 10,
       },
       endPadding: {
         paddingRight: props.width - props.CARD_WIDTH,
       },
       card: {
         padding: 10,
         elevation: 2,
         backgroundColor: "#FFF",
         marginHorizontal: 10,
         shadowColor: "#000",
         shadowRadius: 5,
         shadowOpacity: 0.3,
         shadowOffset: { x: 2, y: -2 },
         height: props.CARD_HEIGHT,
         width: props.CARD_WIDTH,
         overflow: "hidden",
       },
       
       textContent: {
         flex: 1,
       },
       cardtitle: {
         fontSize: 12,
         marginTop: 5,
         fontWeight: "bold",
       },
       cardDescription: {
         fontSize: 12,
         color: "#444",
       },
       markerWrap: {
         alignItems: "center",
         justifyContent: "center",
       },
       marker: {
         width: 8,
         height: 8,
         borderRadius: 4,
         backgroundColor: "rgba(130,4,150, 0.9)",
       },
       ring: {
         width: 24,
         height: 24,
         borderRadius: 12,
         backgroundColor: "rgba(130,4,150, 0.3)",
         position: "absolute",
         borderWidth: 1,
         borderColor: "rgba(130,4,150, 0.5)",
       },
   
   });


