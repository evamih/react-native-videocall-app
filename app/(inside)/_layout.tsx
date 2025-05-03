import { View, Text, TouchableOpacity, Alert, Button, Pressable, StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons} from '@expo/vector-icons';
import { StreamVideoClient } from '@stream-io/video-react-native-sdk';

const Layout = () => {
    
    const { authState, initialized } = useAuth();
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const segments = useSegments();
    const router = useRouter();
    const { onLogout } = useAuth(); //useAuth is the custom hook that returns the auth context
    const handleLogout = async () => {
        Alert.alert('Log out', 'Are you sure?', [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel', //here
            },
            {text: 'OK', onPress: async () => {
                console.log('OK Pressed')
                await onLogout!();
                router.replace('/login');}
            },
          ]);
        
      };
          
  return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: Colors.secondary
            },
            headerTintColor: Colors.tertiary,
        }}>
            <Stack.Screen name="index" options={{ 
                title: 'Meeting rooms',
                header: () => (
                    
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Meeting rooms</Text>
                        <Pressable style={styles.icon} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={34} color={Colors.tertiary} />
                        </Pressable>
                    </View>
                    
                ), }} />
            <Stack.Screen name="(room)/[id]" options={{ title: 'Room' }} />
        </Stack>
  );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: Colors.secondary,
        shadowRadius: 5,
        shadowColor: 'black',
        elevation: 20,
    },
    headerText: {
        fontSize: 25,
        color: Colors.tertiary,
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
        textShadowColor: 'grey', 
        textShadowOffset: { width: 0.5, height: 0.5 }, 
        textShadowRadius: 1
    },
    icon: {
       padding: 5,
    },
})

export default Layout;