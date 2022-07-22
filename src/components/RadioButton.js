import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import React, { Component } from 'react'

 global.Value=null
 class RadioButton extends Component {
	state = {
		value: null,
	};
componentDidUpdate(){
    global.Value=this.state.value
}

    render() {
        const { PROP } = this.props;
        const { value } = this.state;
        return (
            <View style={{flexDirection:'row'}}>
                <Text style={{position:'absolute',flex: 1,color: '#05375a'}}>Are you a Parking owner?</Text>
                {PROP.map(res => {
                    return (
                        <View key={res.key} style={styles.container}>
                            <Text style={styles.radioText}>{res.text}</Text>
                            <TouchableOpacity
                                style={styles.radioCircle}
                                
                                onPress={() => {
                                    this.setState({
                                        value: res.key,
                                    });
                                }}>
                                  {value === res.key && <View style={styles.selectedRb} />}
                                  
                            </TouchableOpacity>
                        </View>
                        
                    );
                })}
                </View>
        );
        
    }
    
}
export default (RadioButton)
//<Text> Selected: {this.state.value} </Text>

const styles = StyleSheet.create({
	container: {
        paddingTop:'10%',
        marginBottom: 15,
        alignItems: 'center',
        flexDirection: 'row',
		justifyContent: 'space-between',
	},
    radioText: {
        marginLeft:60,
        marginRight: 35,
        fontSize: 15,
        color: '#000',
        fontWeight: '700'
    },
	radioCircle: {
		height: 20,
		width: 20,
        marginLeft:-20,
		borderRadius: 100,
		borderWidth: 2,
		borderColor: '#05375a',
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedRb: {
		width: 10,
		height: 10,
		borderRadius: 50,
		backgroundColor: '#05375a',
    },
    result: {
        marginTop: 20,
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#F3FBFE',
    },
}); 