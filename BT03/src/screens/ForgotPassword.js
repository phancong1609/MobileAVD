import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import api from '../api/api';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);

    // Send OTP for password reset
    const handleSendOtp = async () => {
        try {
            await api.post('/users/forgot-password', { email });
            Alert.alert('OTP Sent', 'Please check your email for the OTP.');
            setStep(2);
        } catch (error) {
            Alert.alert('Failed', 'Failed to send OTP.');
        }
    };

    // Reset password
    const handleResetPassword = async () => {
        try {
            await api.put('/users/reset-password', { email, otp, newPassword });
            Alert.alert('Password Reset', 'Your password has been successfully reset.');
            setStep(1);
        } catch (error) {
            Alert.alert('Failed', 'Invalid OTP or reset attempt failed.');
        }
    };

    return (
        <View className="flex-1 justify-center px-4 bg-white ">
            {step === 1 ? (
                <>
                    <Text className="text-xl font-bold mb-4">Reset Password</Text>
                    <Text className="text-base text-gray-600 mb-2">Enter your email to reset password</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        className="border border-gray-300 rounded p-2 mb-4"
                    />
                    <TouchableOpacity
                        onPress={handleSendOtp}
                        className="bg-blue-500 p-3 rounded"
                    >
                        <Text className="text-white text-center">Send OTP</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text className="text-xl font-bold mb-4">Reset Password</Text>
                    <Text className="text-base text-gray-600 mb-2">Enter OTP</Text>
                    <TextInput
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter OTP"
                        className="border border-gray-300 rounded p-2 mb-4"
                    />
                    <Text className="text-base text-gray-600 mb-2">Enter New Password</Text>
                    <TextInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        placeholder="Enter new password"
                        className="border border-gray-300 rounded p-2 mb-4"
                    />
                    <TouchableOpacity
                        onPress={handleResetPassword}
                        className="bg-green-500 p-3 rounded"
                    >
                        <Text className="text-white text-center">Reset Password</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default ForgotPasswordScreen;
