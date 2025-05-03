import { Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { rooms } from '@/assets/data/publicRooms';
import { Link, useRouter } from 'expo-router';
import { ImageBackground } from 'stream-chat-expo';
import prompt from 'react-native-prompt-android';
import Device from 'expo-device';

import { getFavorites } from '@/app/utils/AsyncStorage';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Page = () =>{

  const router = useRouter();
  const [favorites, setFavorites] = useState<{ id: string; name: string; photo: string }[]>([]);
  //const {favorites} = useFavorites();

  useEffect(() => {
    const loadFavorites = async () => {
        const storedFavorites = await getFavorites();
        setFavorites(storedFavorites);
    };
    loadFavorites();
  }, []);

  const onStartMeeting = async () => {
          console.log("starting new meeting");
          const randomId = Math.floor(Math.random() * 1000000).toString();
          router.push({
            pathname: '/(inside)/(room)/[id]',
            params: { id: randomId }});

      }

  const onJoinMeeting = async () => {
      //modal sau alert with id input for joining a meeting
      //Alert.prompt -> doar pt iOS .... pt ambele -> react-native-prompt-android
      console.log("Join a meeting with id: ");
      prompt(
        'Join Meeting',
        'Please enter meeting ID',
        (meetingId) => {
          console.log('Joining meeting with ID:', meetingId);
          router.push({
            pathname: '/(inside)/(room)/[id]',
            params: { id: meetingId }});
        },
      )
  }
    return (
      <ScrollView style={styles.container}>
        <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity onPress={onStartMeeting} style={styles.button}>
            <Ionicons name="videocam-outline" size={22} color={Colors.victoria}/>
            <Text style={styles.buttonText}>Start a meeting!</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onJoinMeeting} style={styles.button}>
            <Ionicons name="videocam-outline" size={22} color={Colors.victoria}/>
            <Text style={styles.buttonText}>Join a meeting!</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.victoria }} />
            <Text style={{ fontSize: 18, color: Colors.victoria, fontWeight: 'condensedBold' }}>or join public room</Text>
          <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.victoria }} />
			  </View>

        <View style={styles.wrapper}>
          {rooms.map((room, index) => (
            <Link key={index} href={{pathname: '/(inside)/(room)/[id]', params: { id: room.id }}} asChild>
              <TouchableOpacity>
                <ImageBackground source={room.img} style={styles.image} imageStyle={{ borderRadius: 5 }}>
                  <View style={styles.overlay}>
                  <Text style={styles.text}>{room.name}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        {favorites.length > 0 && (
        <>
          <View style={styles.divider}>
            <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.victoria }} />
            <Text style={{ fontSize: 18, color: Colors.victoria, fontWeight: 'condensedBold' }}>your saved meetings</Text>
            <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.victoria }} />
          </View>
          <View style={styles.wrapper}>
            {favorites.map((favorite, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  router.push({
                    pathname: '/(inside)/(room)/[id]',
                    params: { id: favorite.id },
                  })
                }
              >
                <ImageBackground
                  source={{ uri: favorite.photo }}
                  style={styles.image}
                  imageStyle={{ borderRadius: 5 }}
                >
                  <View style={styles.overlay}>
                    <Text style={styles.text}>{favorite.name}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30, 
    margin: 10, 
    fontWeight: 'bold', 
    color: Colors.victoria, 
    textShadowColor: 'grey', 
    textShadowOffset: { width: 0.5, height: 0.5 }, 
    textShadowRadius: 1},
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.victoria},
  divider: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 20
    },
  image2:
  {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
		width: WIDTH > HEIGHT ? WIDTH / 4 - 30 : WIDTH - 40,
		height: 200,
    margin: 10,
    padding: 10,
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.4)',
		borderRadius: 10
	},
	text: {
		color: '#fff',
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center'
	},
  button: {
    flex: 1,
		gap: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.tertiary,
    marginTop: 20,
		margin: 10,
		padding: 20,
		borderRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontSize: 17,
    color: Colors.victoria,
    fontWeight: 'bold',
    marginRight: 5,
    justifyContent: 'center',
    textAlign: 'center',
  },
})

export default Page;