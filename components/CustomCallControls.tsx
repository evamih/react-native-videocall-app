
import React from 'react';
import { Alert, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CallControlProps, CallControls as DefaultCallControls, HangUpCallButton, ToggleAudioPublishingButton, ToggleCameraFaceButton, ToggleVideoPublishingButton } from '@stream-io/video-react-native-sdk';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useCallStateHooks } from '@stream-io/video-react-native-sdk';
import { Ionicons} from '@expo/vector-icons';
import * as Device from 'expo-device';

const CustomCallControls = (props: CallControlProps) => {
    const goToHomeScreen = async() => {
        
        router.back();
    }
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();

    const { useCallStatsReport } = useCallStateHooks();
    const stats = useCallStatsReport();

    const getCallStats = async () => {
        const audioStream = stats?.participants;
        if (audioStream) {
            console.log("Audio Codec:", audioStream);
            //Alert.alert("Audio Codec", audioStream.codec);
          } else {
            console.log("No audio stream found.");
            //Alert.alert("Audio Codec", "No audio stream found.");
          }
        const stats1 = stats?.publisherStats.codec;
        const myStats = stats?.publisherStats.rawReport.streams;
        const stats2 = stats?.subscriberStats.rawReport.streams;
        console.log("Call stats: " + JSON.stringify(stats, null, 2));
        Alert.alert("Call stats: ", JSON.stringify(audioStream, null, 2));
    }
    
    return (
        
        <View style={styles.parent}>
            <View style={styles.participants}>
                <Ionicons name="people-outline" size={18} color={Colors.tertiary} />
                <Text style={styles.participantCountText}>  {participants.length}</Text>
            </View>
            <View style={styles.customControls}>
            <ToggleVideoPublishingButton/>
            <ToggleAudioPublishingButton/>
            <ToggleCameraFaceButton/>
            <HangUpCallButton onHangupCallHandler={goToHomeScreen}/>
            </View>
            <TouchableOpacity onPress={getCallStats} style={styles.statsButtonContainer}>
                <Ionicons name="stats-chart-outline" size={24} color={Colors.tertiary} />
            </TouchableOpacity>
            {/* <DefaultCallControls {...props} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    parent: {
        backgroundColor: Colors.mediu,
        color: Colors.mediu,
        flexDirection: 'row',
    },
    customControls: {
        backgroundColor: Colors.mediu,
        color: Colors.mediu, 
        paddingTop: 10,
        paddingBottom: Device.brand == 'samsung' ? 110 : 130, //110 samsung restul 130
        paddingRight: 0,
        borderRadius: 0,
        paddingLeft: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 17
    },
    participants: {
        flexDirection: 'column', flex: 1, marginVertical: 15, marginLeft: 8
    },
    participantCountText: {
        color: Colors.tertiary,
        fontSize: 12,
        fontWeight: 'bold',
        justifyContent: 'flex-start'
    },
    statsButtonContainer: {
        alignItems: 'center',
        marginVertical: 15,
        marginRight: 10,
      },
      statsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        borderRadius: 8,
      },
});

export default CustomCallControls;