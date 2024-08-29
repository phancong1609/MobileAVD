import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, ActivityIndicator, Alert, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = require('../assets/login_background.png');

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        if (localStorage.getItem('loginState') === 'ok') {
            if (localStorage.getItem('isAdmin') === 'ok') {
                navigation.navigate('Admin');
            } else {
                navigation.navigate('Home');
            }
        }
    }, []);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('https://wygo-ojzf.onrender.com/users/login', {
                username: email,
                password: password,
            });
            const userResponse = await axios.get(`https://wygo-ojzf.onrender.com/users/user/${email}`);
            localStorage.setItem('username', userResponse.data.username);
            localStorage.setItem('idUser', userResponse.data.id);
            localStorage.setItem('loginState', 'ok');
            localStorage.setItem('avatar', userResponse.data.avatar);
            if (userResponse.data.username === 'admin' || userResponse.data.username === 'admin1' || userResponse.data.username === 'admin2') {
                localStorage.setItem('isAdmin', 'ok');
                navigation.navigate('Admin');
            } else {
                localStorage.setItem('name', userResponse.data.name);
                navigation.navigate('Home');
            }
        } catch (error) {
            setIsLoading(false);
            setModalMessage(error.response.data);
            setModalVisible(true);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.header}>Đăng Nhập</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
                        <Text style={styles.link}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#007bff" />
                    ) : (
                        <Button title="Đăng Nhập" onPress={handleLogin} color="#007bff" />
                    )}
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>

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
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    form: {
        width: '100%',
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        elevation: 3,
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 16,
        paddingHorizontal: 8,
        width: '100%',
    },
    link: {
        color: 'blue',
        marginBottom: 16,
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

export default Login;
