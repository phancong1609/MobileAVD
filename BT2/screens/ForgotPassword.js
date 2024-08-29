import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleSubmitEmail = async () => {
        try {
            const response = await axios.get(`https://wygo-ojzf.onrender.com/users/user/${email}`);
            setUser(response.data);
            setStep(2);
            await axios.post('https://wygo-ojzf.onrender.com/sendOTP', {
                email: response.data.email,
                otp: '',
            });
        } catch (error) {
            setModalMessage("Không tìm thấy người dùng!");
            setModalVisible(true);
        }
    };

    const handleSubmitVerification = async () => {
        try {
            await axios.post('https://wygo-ojzf.onrender.com/verifyOTP', {
                email: user.email,
                otp: verificationCode,
            });
            await axios.post('https://wygo-ojzf.onrender.com/users/change-info', {
                username: user.username,
                changeType: 'password',
                newInfo: newPassword,
            });
            setStep(3);
        } catch (error) {
            setModalMessage(error.response.data);
            setModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            {step === 1 && (
                <View style={styles.form}>
                    <Text style={styles.header}>Quên Mật Khẩu</Text>
                    <Text style={styles.instructions}>
                        Hãy cho chúng tôi biết địa chỉ email hoặc username của bạn.
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Button title="Xác Nhận" onPress={handleSubmitEmail} />
                </View>
            )}
            {step === 2 && (
                <View style={styles.form}>
                    <Text style={styles.header}>Xác Thực</Text>
                    <Text style={styles.instructions}>
                        Vui lòng kiểm tra email của bạn và nhập mã xác thực đã được gửi cùng với mật khẩu mới.
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mã Xác Thực"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mật Khẩu Mới"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <Button title="Xác Nhận" onPress={handleSubmitVerification} />
                </View>
            )}
            {step === 3 && (
                <View style={styles.message}>
                    <Text>Mật khẩu của bạn đã được cập nhật thành công. Vui lòng đăng nhập lại bằng mật khẩu mới.</Text>
                    <TouchableOpacity onPress={() => {/* Handle navigation back to home */}}>
                        <Text style={styles.link}>Trở lại trang chủ</Text>
                    </TouchableOpacity>
                </View>
            )}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>{modalMessage}</Text>
                        <Button title="Đóng" onPress={() => setModalVisible(false)} />
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
    form: {
        width: '100%',
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 3,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    instructions: {
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    message: {
        alignItems: 'center',
        padding: 16,
    },
    link: {
        color: 'blue',
        marginTop: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
    },
});

export default ForgotPassword;
