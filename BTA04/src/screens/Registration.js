import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api/api';

const RegistrationScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const navigation = useNavigation();

    // Register user with name, email, and password
    const handleRegister = async () => {
        try {
            await api.post('/users/register', { email, password, name });
            Alert.alert('Success', 'Please check your email for the OTP.');
            setStep(2);
        } catch (error) {
            Alert.alert('Registration Failed', 'Could not create user.');
        }
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
        try {
            await api.post('/users/verify-otp', { email, otp }); // Updated endpoint
            Alert.alert('Registration Complete', 'You can now login.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('OTP Verification Failed', 'Invalid OTP.');
        }
    };

    return (
        <View className="flex-1 justify-center px-4 bg-white">
            {step === 1 ? (
                <>
                    {/*<Text className="text-xl font-bold mb-4">Register</Text>*/}
                    <Text className="text-base text-gray-600 mb-2">Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        className="border border-gray-300 rounded p-2 mb-4"
                    />
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
                    <TouchableOpacity
                        onPress={handleRegister}
                        className="bg-blue-500 p-3 rounded mb-4"
                    >
                        <Text className="text-white text-center">Register</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text className="text-xl font-bold mb-4">Verify OTP</Text>
                    <Text className="text-base text-gray-600 mb-2">Enter OTP</Text>
                    <TextInput
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter OTP"
                        className="border border-gray-300 rounded p-2 mb-4"
                    />
                    <TouchableOpacity
                        onPress={handleVerifyOtp}
                        className="bg-green-500 p-3 rounded"
                    >
                        <Text className="text-white text-center">Verify OTP</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default RegistrationScreen;
