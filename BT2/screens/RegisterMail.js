import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Alert, Modal } from 'react-native';
import axios from 'axios';

const OtpForm = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleSendOTP = async () => {
        if (!validateEmail(email)) {
            setMessage({ type: 'error', content: 'Địa chỉ email không hợp lệ' });
            return;
        }

        setIsSending(true);

        try {
            // Kiểm tra xem email đã tồn tại chưa
            const checkEmailResponse = await axios.get(`https://wygo-ojzf.onrender.com/users/user/${email}`);

            // Nếu nhận được một object, nghĩa là email đã tồn tại
            if (checkEmailResponse.data) {
                setMessage({ type: 'error', content: 'Email đã tồn tại' });
                return;
            }

            // Nếu email không tồn tại, gửi OTP
            const response = await axios.post('https://wygo-ojzf.onrender.com/sendOTP', { email });
            setMessage({ type: 'success', content: response.data });
            setIsOtpSent(true);
        } catch (error) {
            if (error.response.status === 400 || error.response.status === 500) {
                // Nếu nhận được bad request, cho phép tiếp tục gửi OTP
                const response = await axios.post('https://wygo-ojzf.onrender.com/sendOTP', { email });
                setMessage({ type: 'success', content: response.data });
                setIsOtpSent(true);
            } else {
                // Xử lý các lỗi khác
                setMessage({ type: 'error', content: error.response.data });
            }
        } finally {
            setIsSending(false);
        }
    };

    const handleVerifyOTP = async () => {
        setIsVerifying(true);
        try {
            const response = await axios.post('https://wygo-ojzf.onrender.com/verifyOTP', { email, otp });
            setMessage({ type: 'success', content: response.data });
            // Lưu email đã xác thực vào local storage
            // For React Native, you might use AsyncStorage instead of localStorage
            await AsyncStorage.setItem('verifiedEmail', email);
            setShowSuccessPopup(true);
        } catch (error) {
            setMessage({ type: 'error', content: error.response.data });
        } finally {
            setIsVerifying(false);
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleResendOTP = () => {
        setIsOtpSent(false);
        setOtp('');
        setMessage({ type: '', content: '' });
    };

    useEffect(() => {
        if (showSuccessPopup) {
            setTimeout(() => {
                // Navigate to registration screen after 3 seconds
                navigation.navigate('Registration');
            }, 3000);
        }
    }, [showSuccessPopup]);

    const handleCloseMessage = () => {
        setMessage({ type: '', content: '' });
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Xác thực OTP</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                {!isOtpSent ? (
                    <Button
                        title={isSending ? 'Gửi OTP...' : 'Gửi OTP'}
                        onPress={handleSendOTP}
                        disabled={isSending || !validateEmail(email)}
                    />
                ) : (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="OTP"
                            value={otp}
                            onChangeText={setOtp}
                        />
                        <Button
                            title={isVerifying ? 'Xác nhận OTP...' : 'Xác nhận OTP'}
                            onPress={handleVerifyOTP}
                            disabled={!otp || isVerifying}
                        />
                        <Button
                            title={isSending ? 'Gửi lại OTP...' : 'Gửi lại OTP'}
                            onPress={handleResendOTP}
                            disabled={isSending}
                        />
                    </>
                )}
            </View>
            {message.content ? (
                <View style={[styles.message, message.type === 'success' ? styles.successMessage : {}]}>
                    <Text style={styles.messageText}>{message.content}</Text>
                </View>
            ) : null}
            <Modal
                transparent={true}
                animationType="slide"
                visible={showSuccessPopup}
                onRequestClose={() => setShowSuccessPopup(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Xác thực email thành công!</Text>
                        <Text style={styles.modalMessage}>Chuyển đến trang đăng ký sau 3 giây...</Text>
                        <Button
                            title="Đăng ký tài khoản"
                            onPress={() => navigation.navigate('Registration')}
                        />
                        <Button
                            title="Quay lại"
                            onPress={() => setShowSuccessPopup(false)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    message: {
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: [{ translateX: -50 }],
        width: 'fit-content',
        backgroundColor: '#f44336',
        color: '#fff',
        padding: 12,
        borderRadius: 4,
        textAlign: 'center',
        zIndex: 1,
    },
    successMessage: {
        backgroundColor: '#4caf50',
    },
    messageText: {
        color: '#fff',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
    },
});

export default OtpForm;
