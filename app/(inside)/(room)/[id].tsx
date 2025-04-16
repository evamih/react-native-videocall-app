import { View, Text, StyleSheet, Dimensions, Share, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Call, CallContent, StreamCall, useStreamVideoClient, useCallStateHooks, StreamVideoEvent } from '@stream-io/video-react-native-sdk';
import Spinner from 'react-native-loading-spinner-overlay';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import CustomCallControls from '@/components/CustomCallControls';
import { ScrollView } from 'react-native-gesture-handler';
import ChatView from '@/components/ChatView';
import CustomBottomSheet from '@/components/CustomBotoomSheet';
import CustomTopView from '@/components/CustomTopView';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Colors from '@/constants/Colors';


const Page = () => {

    const WIDTH = Dimensions.get('window').width;
    const HEIGHT = Dimensions.get('window').height;

    const client = useStreamVideoClient();
    const [call, setCall] = useState<Call | null>(null);
    const { id } = useLocalSearchParams<{ id: string}>();

    const router = useRouter();
    const navigation = useNavigation();
    

    useEffect(() => {
        if(!client || call) return;

        const joinCall = async() => {
            console.log("joining call with id: ", id); 
            const call = client!.call('default', id);
            await call.join({create: true});
            setCall(call);
        }
        joinCall();
    }, [call]);

    useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPressOut={shareMeeting}>
					<Ionicons name="share-outline" size={24} color={Colors.tertiary} />
				</TouchableOpacity>
			)
		});

		// Listen to call events
		const unsubscribe = client!.on('all', (event: StreamVideoEvent) => {
			//console.log(event);

			if (event.type === 'call.session_participant_joined') {
				console.log(`New user joined the call: ${event.participant.user_session_id}`);
				const user = event.participant.user.name;
				Toast.show({
					text1: 'User joined',
					text2: `Say hello to ${user}`
				});
			}

			if (event.type === 'call.session_participant_left') {
				console.log(`Someone left the call: ${event.participant}`);
				const user = event.participant.user.name;
				Toast.show({
					text1: 'User left',
					text2: `Say goodbye to ${user}`
				});
			}
		});

		// Stop the listener when the component unmounts
		return () => {
			unsubscribe();
		};
	}, []);

    const goToHomeScreen = async() => {
        
        router.back();
    }

    const shareMeeting = async () => {
		Share.share({
			message: `Join my meeting with this code: ${id}`
		});
	};

    if(!call) return null;

  return (
    <View style={{flex: 1}}>
      <Spinner visible={!call}/>

      <StreamCall call={call}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
            <View style={styles.container}>
                
                <CallContent 
                    onHangupCallHandler={goToHomeScreen} 
                    CallControls={CustomCallControls} 
                    layout="grid">
                </CallContent>
                {WIDTH > HEIGHT ? (
                    <View style={styles.chatContainer}>
                        <ChatView channelId={id} />
                    </View>
                ) : (
                    <CustomBottomSheet channelId={id}/>
                )}
                
            </View>
        </TouchableWithoutFeedback>
    </StreamCall>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column', //doar pt mobil... pt tableta sau desktop -> row
    },
    chatContainer: {
        backgroundColor: '#1b1a1c',
        color: 'white',
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    

})

export default Page;