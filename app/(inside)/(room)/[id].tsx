import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Call, CallContent, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import Spinner from 'react-native-loading-spinner-overlay';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import CustomCallControls from '@/components/CustomCallControls';
import { ScrollView } from 'react-native-gesture-handler';
import ChatView from '@/components/ChatView';
import CustomBottomSheet from '@/components/CustomBotoomSheet';


const Page = () => {

    const WIDTH = Dimensions.get('window').width;
    const HEIGHT = Dimensions.get('window').height;

    const client = useStreamVideoClient();
    const [call, setCall] = useState<Call | null>(null);
    const { id } = useLocalSearchParams<{ id: string}>();
    const router = useRouter();

    useEffect(() => {
        if(!client || call) return;

        const joinCall = async() => {
            console.log("joining call with id: ", id); 
            const call = client!.call('default', id);
            await call.join({create: true});
            setCall(call);
        }
        joinCall();
    }, [call])

    const goToHomeScreen = async() => {
        
        router.back();
    }

    if(!call) return null;

  return (
    <View style={{flex: 1}}>
      <Spinner visible={!call}/>

      <StreamCall call={call}>
        <View style={styles.container}>
        <CallContent onHangupCallHandler={goToHomeScreen} CallControls={CustomCallControls}/>
        {WIDTH > HEIGHT ? (
            <View style={styles.chatContainer}>
            <ChatView channelId={id} />
            </View>
        ) : (
            <CustomBottomSheet channelId={id}/>
        )}
            
        </View>
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