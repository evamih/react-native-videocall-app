import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

//un clasic auth context, cu secure store
//nu uita sa check out auth context tutorial 

interface AuthProps {
    authState: { 
        token: string | null; 
        authenticated: boolean |null; 
        user_id: string | null; 
    };
    onRegister: (email: string, password: string) => Promise<any>;
    onLogin: (email: string, password: string) => Promise<any>;
    onLogout: () => Promise<any>;
    initialized: boolean;
}

const TOKEN_KEY = 'auth_token';
export const API_URL = process.env.EXPO_PUBLIC_SERVER_URL;
const AuthContext = createContext<Partial<AuthProps>>({});

// access to provider
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {

    const [authState, setAuthState] = useState<{
        token: string | null; 
        authenticated: boolean | null; 
        user_id: string | null; 
    }>({
        token: null,
        authenticated: null,
        user_id: null,
    });
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const loadToken = async () => {
            const data = await SecureStore.getItemAsync(TOKEN_KEY);
            if(data) {
                const object = JSON.parse(data);
                //set context state
                setAuthState({
                    token: object.token,
                    authenticated: true,
                    user_id: object.user.id,
                });
            }
            setInitialized(true);
        };
        loadToken();
    }, []);

    const login = async (email: string, password: string) => {
        try{
            //fetch POST request to /login
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            setAuthState({
                token: data.token,
                authenticated: true,
                user_id: data.user.id,
            });

            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(data));

            return response;

            } 
            catch (error) 
            {
                return {error: true, msg: (error as any).response.data.msg};
            }
    };

    const register = async (email: string, password: string) => {
        try{
            //fetch POST request to /register
            console.log('API_URL:', API_URL);
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const data = await response.json();
            console.log('register:', data);

            setAuthState({
                token: data.token,
                authenticated: true,
                user_id: data.user.id,
            });

            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(data));

            return data;
            } 
            catch (error) 
            {
                return {error: true, msg: (error as any).response.data.msg};
            }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        console.log('logging out...');
        setAuthState({
            token: null,
            authenticated: false,
            user_id: null,
        });
        
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
        initialized
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};