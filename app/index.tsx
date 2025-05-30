import { Animated, Text, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { TextInput } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Page = () => {

    //hooks:
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin, onRegister } = useAuth(); //useAuth is the custom hook that returns the auth context


    //functions:
    const onSignInPress = async () => {
        setLoading(true);
        try {
            const response = await onLogin!(email, password);
            console.log(" onSignInPress - response: ", response);
        } catch (error) {
            Alert.alert('Error', 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };
    const onSignUpPress = async () => {
        setLoading(true);
        try {
            const response = await onRegister!(email, password);
            console.log(" onSignUpPress - response: ", response);
        } catch (error) {
            Alert.alert('Error', 'Registration failed. Please try again.'+ error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.container}>
            <Spinner visible={loading}/>
            
            <Image style={styles.logo} source={require('@/assets/images/logo2.png')} />
            <Text style={styles.header}>Log in</Text>
            <Text style={styles.subHeader}>Welcome to my video conference application!</Text>
            <TextInput
                placeholder='ceva@mail.com'
                value={email}
                onChangeText={setEmail}
                style={styles.inputField}
            />
            <TextInput
                placeholder='password'
                value={password}
                secureTextEntry={true}
                textContentType='password'
                onChangeText={setPassword}
                style={styles.inputField}
            />
            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
                <Text style={{color: Colors.tertiary}}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignSelf: 'center', marginTop: 10}} onPress={onSignUpPress}>
                <Text style={{color: '#557a71'}}>Don't have an account? Sign up here!</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: WIDTH > HEIGHT ? '35%' : '10%',
    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
    },
    inputField: {
        height: 50,
        borderColor: '#557a71',
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 40,
        borderRadius: 20
    },
    button: {
        marginVertical: 10,
        alignItems: 'center',
        backgroundColor: Colors.mediu,
        padding: 15,
        borderRadius: 4,
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '40%',
    }
})
export default Page;