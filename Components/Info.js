import { View, Text, StyleSheet, Linking, Dimensions, Animated, Platform } from 'react-native'
import React, {useState, useContext} from 'react'
import { TouchableOpacity } from 'react-native'
import { UserContext } from '../UserContext';


const WIDTH = Dimensions.get('window').width;
const platform = Platform.OS === "ios";

const Info = ({scale, date, time, speaker, speech, location}) => {
    const [showspeech, setShowspeech] = useState(false);
    const {userCredentials} = useContext(UserContext)

    const handleShowSpeech = ()=>{
        setShowspeech(!showspeech);
    }
    
  return (
    <Animated.View 
        style={[styles.infoContainer, {transform:[{scale}]}]}>
        <View style= {styles.info}>
            <Text style= {styles.infoTitle}> Date:</Text>
            <Text style= {styles.infoText}> {date} </Text>
        </View>
        <View style= {styles.info}>
            <Text style= {styles.infoTitle}> Time:</Text>
            <Text style= {styles.infoText}> {time} </Text>
        </View>
        <View style= {styles.info}>
            <Text style= {styles.infoTitle}> Speaker:</Text>
            <Text style= {styles.infoText}> {speaker} </Text>
        </View>
        <View style= {styles.info}>
            <Text style= {styles.infoTitle}> Location:</Text>
            <TouchableOpacity 
            // onPress={()=> Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${location}`)}
            onPress={()=> Linking.openURL(`https://www.google.com/maps/dir/${userCredentials.Location}/${location}`)}

            >
                <Text style= {[styles.infoText, {borderWidth:1, flexWrap:'wrap', width: platform? WIDTH-130 : WIDTH-150, borderColor:"blue", borderRadius:5, shadowColor:"gray", shadowOffset:{width:0, height:10}, shadowOpacity:0.5, shadowRadius:20}]}> 
                {location} </Text>
            </TouchableOpacity>
        </View>
        
        <View style= {styles.info}>
            <TouchableOpacity >
                <Text style= {[styles.infoTitle , styles.infoSpeech]} onPress={handleShowSpeech}> Speech:</Text>
            </TouchableOpacity>
            { showspeech == true ?
                <Text style= {[styles.infoText, {marginTop:5, paddingTop:2, width:WIDTH-130}]}> {speech}</Text> : 
                <Text style= {styles.infoText}></Text>
            }         
        </View>
      
    </Animated.View>
  )
}

export default Info

const styles = StyleSheet.create({
    infoContainer: {
        width: platform? WIDTH-30 : WIDTH-40, 
        margin:15,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius:20,   
        padding: 10,
        justifyContent:"center",
        alignContent:"center",
        flex:1,
        textAlignVertical: 'top',
        shadowColor:"gray", 
        shadowOffset:{
            width:0, 
            height:10
        }, 
        shadowOpacity:0.5,
        shadowRadius:20,    
       

    },
    info:{
        // zIndex:-100,
        flexDirection:"row",
    },
    infoTitle:{
        fontSize:15, 
        fontWeight:"bold", 
        color:'black',
        opacity: 0.7,
        paddingBottom:4,
        justifyContent:"center",
        
    },

    infoText:{
        fontSize:15, 
        color:'black',
        opacity: 0.6,
        paddingBottom:5,
        paddingLeft:3.5,
        paddingRight:20,
        marginRight:45,
        
    },
    infoSpeech:{
        color:"blue",
        fontWeight:"bold", 
        fontSize: 15,
        marginLeft:5,
        // border:"1px solid blue", 
        borderWidth:1.5,
        borderColor:"blue",
        borderRadius:10,   
        shadowColor:"gray", 
        shadowOffset:{
            width:0, 
            height:10
        }, 
        shadowOpacity:0.5,
        shadowRadius:20,  
        padding:2,
        paddingBottom:3,
        marginTop:5,

    }
})