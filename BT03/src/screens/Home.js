import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode'; // Fix import: Remove curly braces
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from "../api/api";

const HomeScreen = () => {
    const [userName, setUserName] = useState('');
    const navigation = useNavigation();

    const getUserInfo = async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            if (user) {
                const parsedUser = JSON.parse(user);
                const decodedToken = jwtDecode(parsedUser.token);
                const id = decodedToken.id;
                const response = await api.get(`users/${id}`);
                setUserName(response.data.name);
            } else {
                navigation.replace('Login');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to retrieve user information.');
            navigation.replace('Login');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getUserInfo(); // Fetch user info when screen comes into focus
        }, [])
    );

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        navigation.replace('Login');
    };

    return (
        <View className="flex-1 justify-center items-center px-4 bg-white">
            <Text className="text-2xl font-bold mb-6">Welcome, {userName || 'Guest'}!</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                className="bg-blue-500 p-4 rounded mb-4"
            >
                <Text className="text-white text-center text-lg">Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500 p-4 rounded"
            >
                <Text className="text-white text-center text-lg">Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
