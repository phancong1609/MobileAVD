import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    // Check if user is already logged in
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    if (user.token) {
                        navigation.replace('Home'); // Navigate to Home if token is found
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to check login status.');
            }
        };

        checkLoggedIn();
    }, []);

    const handleLogin = async () => {
        try {
            const response = await api.post('/users/login', { email, password }); // Updated endpoint to '/users/login'
            const { token } = response.data;

            // Store token in AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify({ token }));

            // Navigate to Home
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Login Failed', 'Please check your credentials.');
        }
    };

    return (
        <View className="flex-1 justify-center px-4 bg-white">
            {/*<Text className="text-xl font-bold mb-2">Login</Text>*/}
            <Text className="text-base text-gray-600 mb-2">Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                className="border border-gray-300 rounded p-2 mb-4"
            />
            <Text className="text-base text-gray-600 mb-2">Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter your password"
                className="border border-gray-300 rounded p-2 mb-4"
            />

            {/* TouchableOpacity Buttons */}
            <TouchableOpacity
                onPress={handleLogin}
                className="bg-blue-500 p-3 rounded mb-4"
            >
                <Text className="text-white text-center">Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Registration')}
                className="bg-gray-500 p-3 rounded mb-4"
            >
                <Text className="text-white text-center">Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                className="bg-gray-500 p-3 rounded"
            >
                <Text className="text-white text-center">Forgot Password</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
