
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CallControlProps, CallParticipantsSpotlight, CallControls as DefaultCallControls, HangUpCallButton, ParticipantLabel, ParticipantView, ToggleAudioPublishingButton, ToggleCameraFaceButton, ToggleVideoPublishingButton } from '@stream-io/video-react-native-sdk';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

const CustomCallControls = (props: CallControlProps) => {
    const goToHomeScreen = async() => {
        
        router.back();
    }
    
    return (
        
        <View style={styles.customControls}>
            <ToggleVideoPublishingButton/>
            <ToggleAudioPublishingButton/>
            <ToggleCameraFaceButton/>
            <HangUpCallButton onHangupCallHandler={goToHomeScreen}/>
            
            {/* <DefaultCallControls {...props} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    customControls: {
        backgroundColor: Colors.secondary,
        color: Colors.secondary, 
        padding: 10,
        paddingBottom: 110,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default CustomCallControls;