import { Button, Alert, View, Text, Image, TextInput, StyleSheet, Dimensions, Share, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Call, CallContent, StreamCall, useStreamVideoClient, useCallStateHooks, StreamVideoEvent } from '@stream-io/video-react-native-sdk';
import Spinner from 'react-native-loading-spinner-overlay';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import CustomCallControls from '@/components/CustomCallControls';
import ChatView from '@/components/ChatView';
import CustomBottomSheet from '@/components/CustomBotoomSheet';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';

import { saveFavorites, getFavorites } from '@/app/utils/AsyncStorage';
import prompt from 'react-native-prompt-android';


const Page = () => {

    const WIDTH = Dimensions.get('window').width;
    const HEIGHT = Dimensions.get('window').height;

    const client = useStreamVideoClient();
    const [call, setCall] = useState<Call | null>(null);
    const { id } = useLocalSearchParams<{ id: string}>();

    const [isFavorite, setIsFavorite] = useState(false);

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

        //try1
        return () => {
            if (call) {
                console.log("Leaving call...");
                (call as Call).leave();
            }
        };
    }, [call]);

    useEffect(() => {
        console.log("isFavorite updated:", isFavorite);
    }, [isFavorite]);

    useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
                <View style={{flexDirection: 'row', gap: 10}}>
				<TouchableOpacity onPressOut={shareMeeting}>
					<Ionicons name="share-outline" size={24} color={Colors.tertiary} />
				</TouchableOpacity>
                <TouchableOpacity onPressOut={addToFavorites}>
                    <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={Colors.tertiary} />
                </TouchableOpacity>
                {/* <TouchableOpacity onPressOut={getCallStats}>
					<Ionicons name="call-outline" size={24} color={Colors.tertiary} />
				</TouchableOpacity> */}
                </View>
			)
		});

        //try1 + client!.on mai jos
        if (!client) return; 

		// Listen to call events
		const unsubscribe = client.on('all', (event: StreamVideoEvent) => {
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
            console.log("unsubscribing from call events...");
			unsubscribe();
		};
	}, [client, isFavorite, navigation]);

    //try2 - iesire din apel la apasare inapoi
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            if (call) {
                console.log("Leaving call before navigating back...");
                call.leave();
            }
        });

        return unsubscribe;
    }, [navigation, call]);

    const goToHomeScreen = async() => {
        
        router.back();
    }

    const shareMeeting = async () => {
		Share.share({
			message: `Join my meeting with this code: ${id}`
		});
	};

    useEffect(() => {
        const checkIfFavorite = async () => {
            const currentFavorites = await getFavorites();
            console.log("Current favorites: ", currentFavorites);
            const isAlreadyFavorite = currentFavorites.some((fav: { id: string }) => fav.id === id);
            console.log("Is already favorite: ", isAlreadyFavorite);
            setIsFavorite(isAlreadyFavorite); // Set the state based on whether the meeting is already a favorite
            //console.log("Is favorite: ", isFavorite);
        };
        checkIfFavorite();
    }, [id]);

    const addToFavorites = async () => {

        if (isFavorite) {
            Alert.alert('Already a Favorite', 'This meeting is already in your favorites.');
            
            Alert.alert(
                'Remove from favorites',
                'Are you sure you want to remove this meeting from your favorites?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    style: 'destructive',
                    onPress: async () => {
                        console.log('Removing from favorites...');
                        const currentFavorites = await getFavorites();
                        const updatedFavorites = currentFavorites.filter((fav: { id: string }) => fav.id !== id);
                        await saveFavorites(updatedFavorites);
                        console.log('Favorites after removal:', updatedFavorites);

                       
                        setIsFavorite(false);
                        Alert.alert('Removed', 'Meeting removed from favorites.');
                    },
                  }
                ],
                {
                  cancelable: true
                },
              );
            
            return;
        }
        
        prompt(
            'Add to Favorites',
            'Enter a name for this meeting:',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async (name) => {
                        if (!name) {
                            Alert.alert('Error', 'Please provide a name for the meeting.');
                            return;
                        }

                        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (!permissionResult.granted) {
                            Alert.alert('Permission Denied', 'You need to allow access to your media library to select a photo.');
                            return;
                        }

                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ['images'],
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        });

                        if (!result.canceled) {
                            const photoUri = result.assets[0].uri;
                            const newFavorite = { id, name: name.trim(), photo: photoUri };

                            const currentFavorites = await getFavorites();
                            const updatedFavorites = [...currentFavorites, newFavorite];
                            await saveFavorites(updatedFavorites);
                            console.log('Favorites updated:', updatedFavorites);

                            
                            setIsFavorite(true);
                            Alert.alert('Success', 'Meeting added to favorites!');
                        } else {
                            Alert.alert('Cancelled', 'No photo was selected.');
                        }
                    },
                },
            ],
            {
                type: 'plain-text',
                placeholder: 'Meeting Name',
            }
            
        );
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        width: '85%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 4,
      },
      input: {
        borderBottomWidth: 1,
        marginBottom: 10,
        paddingVertical: 5,
      },
      imageButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
      },
      imageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      imagePreview: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginVertical: 10,
      },

})

export default Page;