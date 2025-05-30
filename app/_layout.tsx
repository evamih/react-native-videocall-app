
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { StreamVideoClient, StreamVideo, User } from "@stream-io/video-react-native-sdk";
import { OverlayProvider } from 'stream-chat-expo';
import Toast from "react-native-toast-message";

const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;

const InitialLayout = () => {
    const { authState, initialized } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [client, setClient] = useState<StreamVideoClient | null>(null);

    useEffect(() => {
        if(!initialized) return;

        const inAuthGroup = segments[0] === "(inside)";
        console.log("inAuthGroup: ", inAuthGroup);
        console.log("authState: ", authState);
        if(authState?.authenticated && !inAuthGroup) {
            console.log("user is authenticated and not in auth group, redirecting to inside");

            router.replace('/(inside)');
        }else if (!authState?.authenticated && inAuthGroup) {
            console.log("user is not authenticated, redirecting to login page");
            console.log("Current segments: ", segments);
            client?.disconnectUser();
            //setClient(null);
            router.navigate('/');
            console.log("after segments: ", segments);
        } else if (!authState?.authenticated) {
            console.log("User is unauthenticated, redirecting to index");
            console.log("Current segments: ", segments);
            router.replace('/');
        }

    }, [authState,initialized]);

    useEffect(() => {
        if(authState?.authenticated && authState.token) {
            console.log("creare client stream video");
            const user: User = {id: authState.user_id!};

            try{
                const client = StreamVideoClient.getOrCreateInstance({apiKey: STREAM_KEY!, user, token: authState.token});
                setClient(client);
            } catch(e) {
                console.log("Error creating client: ", e);
            }
        }

    }, [authState])

    return (
        // if client is set then we are in the app, else we are in the auth page
        <>
        {!client && (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        )}
        {client && (
            <StreamVideo client={client}>
                <OverlayProvider>
                    <Slot/>
                    <Toast />
                </OverlayProvider>
            </StreamVideo>
        )}
        </>
    );
}

const RootLayout = () =>  {
    return (
            <AuthProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <InitialLayout/>
                </GestureHandlerRootView>
            </AuthProvider>
    );
}

export default RootLayout;

// import 'react-native-gesture-handler';
// import React, { useEffect, useState } from 'react';
// import { Slot, Stack, useRouter, useSegments } from 'expo-router';
// import { StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-native-sdk';
// import { AuthProvider, useAuth } from '../context/AuthContext';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { OverlayProvider } from 'stream-chat-expo';
// import Toast from 'react-native-toast-message';

// const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;

// const InitialLayout = () => {
// 	const { authState, initialized } = useAuth();
// 	const [client, setClient] = useState<StreamVideoClient | null>(null);
// 	const segments = useSegments();
// 	const router = useRouter();

// 	//Navigate the user to the correct page based on their authentication state
// 	useEffect(() => {
// 		if (!initialized) return;

// 		// Check if the path/url is in the (inside) group
// 		const inAuthGroup = segments[0] === '(inside)';

// 		if (authState?.authenticated && !inAuthGroup) {
// 			// Redirect authenticated users to the list page
// 			router.replace('/(inside)');
// 		} else if (!authState?.authenticated) {
// 			// Redirect unauthenticated users to the login page
// 			client?.disconnectUser();
// 			//router.replace('/');
// 		}
// 	}, [initialized, authState]);

// 	// Initialize the StreamVideoClient when the user is authenticated
// 	useEffect(() => {
// 		if (authState?.authenticated && authState.token) {
// 			const user: User = { id: authState.user_id! };

// 			try {
// 				const client = new StreamVideoClient({ apiKey: STREAM_KEY!, user, token: authState.token });
// 				setClient(client);
// 			} catch (e) {
// 				console.log('Error creating client: ', e);
// 			}
// 		}
// 	}, [authState]);

// 	// Conditionally render the correct layout
// 	return (
// 		<>
// 			{!client && (
// 				<Stack>
// 					<Stack.Screen name="index" options={{ headerShown: false }} />
// 				</Stack>
// 			)}
// 			{client && (
// 				<StreamVideo client={client}>
// 					<OverlayProvider>
// 						<Slot />
// 						<Toast />
// 					</OverlayProvider>
// 				</StreamVideo>
// 			)}
// 		</>
// 	);
// };

// // Wrap the app with the AuthProvider
// const RootLayout = () => {
// 	return (
// 		<AuthProvider>
// 			<GestureHandlerRootView style={{ flex: 1 }}>
// 				<InitialLayout />
// 			</GestureHandlerRootView>
// 		</AuthProvider>
// 	);
// };

// export default RootLayout;
