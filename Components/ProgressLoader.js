import React, {useRef} from 'react';
import LottieView from "lottie-react-native"
import {View, StyleSheet} from 'react-native';

const ProgressLoader = () => {
    const animation = useRef(null); 
    return (
        <View>
            <LottieView 
            ref={animation}
            style={{
            width: 200,
            height:100,
            }}
            autoPlay={true}
            loop={false}
            speed={0.75}
            source={require("../assets/loading-progress-bar.json")}  />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        justifyContent:"center", 
        alignItems:"center", 
    }
})

export default ProgressLoader;
