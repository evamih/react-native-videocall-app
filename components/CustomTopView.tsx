import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useCallStateHooks } from '@stream-io/video-react-native-sdk';
import Colors from '@/constants/Colors';
import { Ionicons} from '@expo/vector-icons';

const CustomTopView = () => {

    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();

  return (
        <View style={styles.participantCountContainer}>
            <Ionicons name="people-outline" size={24} color={Colors.tertiary} />
            <Text style={styles.participantCountText}>- {participants.length}</Text>
        </View>
    )
    }

    const styles = StyleSheet.create({
        participantCountContainer: {
            backgroundColor: '#1b1a1c',
            padding: 10,
            alignItems: 'center',
            flexDirection: 'row',
        },
        floatingParticipantCount: {
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: [{ translateX: -50 }],
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: 5,
            borderRadius: 5,
            fontSize: 14,
            fontWeight: 'bold',
            zIndex: 10,
        },
        participantCountText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        }
    })

export default CustomTopView