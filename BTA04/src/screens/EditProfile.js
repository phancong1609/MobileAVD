import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

const EditProfileScreen = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [token, setToken] = useState('');

    useEffect(() => {
        // Retrieve token from AsyncStorage
        const fetchUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                const parsedUser = JSON.parse(storedUser);
                setToken(parsedUser?.token || '');
            } catch (error) {
                Alert.alert('Error', 'Failed to retrieve user data.');
            }
        };
        fetchUser();
    }, []);

    // Request OTP
    const handleRequestOtp = async () => {
        try {
            await api.post('/users/request-otp', { email }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            Alert.alert('OTP Sent', 'Check your email for the OTP.');
            setStep(2); // Move to OTP verification step
        } catch (error) {
            Alert.alert('Failed', 'Error requesting OTP.');
        }
    };

    // Verify OTP and update profile
    const handleVerifyOtp = async () => {
        try {
            await api.put('/users/profile', { otp, name }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
            setStep(1); // Reset step
            setName(''); // Clear input fields
            setOtp('');
        } catch (error) {
            Alert.alert('Failed', 'Invalid OTP or update failed.');
        }
    };

    return (
        <View className="flex-1 justify-center px-4 bg-white">
            {step === 1 ? (
                <>
                    <Text className="text-xl font-bold mb-4">Enter Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        className="border border-gray-300 rounded p-2 mb-4"
                    />
                    <TouchableOpacity
                        onPress={handleRequestOtp}
                        className="bg-blue-500 p-3 rounded"
                    >
                        <Text className="text-white text-center text-lg">Request OTP</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text className="text-xl font-bold mb-4">Verify OTP and Update</Text>
                    <Text className="text-base text-gray-600 mb-2">Enter OTP</Text>
                    <TextInput
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter OTP"
                        className="border border-gray-300 rounded p-2 mb-4"
                    />
                    <Text className="text-base text-gray-600 mb-2">Update Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter new name"
                        className="border border-gray-300 rounded p-2 mb-4"
                    />
                    <TouchableOpacity
                        onPress={handleVerifyOtp}
                        className="bg-green-500 p-3 rounded"
                    >
                        <Text className="text-white text-center text-lg">Verify OTP and Update</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default EditProfileScreen;
