
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CallControlProps, CallParticipantsSpotlight, CallControls as DefaultCallControls, HangUpCallButton, ParticipantLabel, ParticipantView, ToggleAudioPublishingButton, ToggleCameraFaceButton, ToggleVideoPublishingButton } from '@stream-io/video-react-native-sdk';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useCallStateHooks } from '@stream-io/video-react-native-sdk';
import { Ionicons} from '@expo/vector-icons';

const CustomCallControls = (props: CallControlProps) => {
    const goToHomeScreen = async() => {
        
        router.back();
    }
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();
    
    return (
        
        <View style={styles.parent}>
            <View style={{flexDirection: 'column', flex: 1, padding: 3}}>
                <Ionicons name="people-outline" size={20} color={Colors.tertiary} />
                <Text style={styles.participantCountText}>  {participants.length}</Text>
            </View>
            <View style={styles.customControls}>
            <ToggleVideoPublishingButton/>
            <ToggleAudioPublishingButton/>
            <ToggleCameraFaceButton/>
            <HangUpCallButton onHangupCallHandler={goToHomeScreen}/>
            </View>
            {/* <DefaultCallControls {...props} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    parent: {
        backgroundColor: Colors.secondary,
        color: Colors.secondary,
        flexDirection: 'row',
    },
    customControls: {
        backgroundColor: Colors.secondary,
        color: Colors.secondary, 
        paddingTop: 10,
        paddingBottom: 110,
        paddingRight: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 17
    },
    participantCountText: {
        color: Colors.tertiary,
        fontSize: 12,
        fontWeight: 'bold',
        justifyContent: 'flex-start'
    }
});

export default CustomCallControls;