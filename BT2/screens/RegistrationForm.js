import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Modal, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const RegistrationForm = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [birth, setBirth] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showRedirectModal, setShowRedirectModal] = useState(false);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const verifiedEmail = localStorage.getItem('verifiedEmail');
        if (verifiedEmail) {
            setEmail(verifiedEmail);
        } else {
            navigation.navigate('EmailVerification');
        }
    }, []);

    const handleChangeEmail = () => {
        localStorage.setItem('verifiedEmail', '');
        navigation.navigate('EmailVerification');
    };

    const handleSubmit = async () => {
        if (!username || !email || !password || !confirmPassword || !name || !birth || !gender) {
            setMessage('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Mật khẩu và mật khẩu nhập lại không khớp');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://wygo-ojzf.onrender.com/users/register', {
                username,
                email,
                password,
                name,
                birth,
                gender
            });

            if (response.status === 200) {
                setMessage('Đăng ký thành công');
                localStorage.setItem('verifiedEmail', '');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setName('');
                setBirth('');
                setGender('');
                setShowRedirectModal(true);
                startCountdown();
            }
        } catch (error) {
            setMessage(error.response.data || 'Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = username && email && password && confirmPassword && name && birth && gender;

    const startCountdown = () => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 0) {
                    clearInterval(timer);
                    navigation.navigate('Home');
                    return prevCountdown;
                } else {
                    return prevCountdown - 1;
                }
            });
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    editable={false}
                />
                <Button title="Thay đổi email" onPress={handleChangeEmail} />
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tên"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ngày sinh"
                    value={birth}
                    onChangeText={setBirth}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Giới tính"
                    value={gender}
                    onChangeText={setGender}
                />
                <Button
                    title={loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    onPress={handleSubmit}
                    disabled={!isFormValid || loading}
                />
            </View>
            <Modal
                visible={showRedirectModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowRedirectModal(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Đăng ký thành công!</Text>
                    <Text>Chuyển đến trang đăng nhập sau {countdown} giây...</Text>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 16,
    },
    message: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
    },
    form: {
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: 'white',
    },
});

export default RegistrationForm;
