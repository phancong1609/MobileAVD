import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IntroScreen = () => {
    const navigation = useNavigation();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    navigation.navigate('HomePage');
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigation]);

    return (
        <View className="flex-1 justify-center items-center bg-gray-200 p-4">
            <Image
                source={{ uri: 'https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/309372849_3250172551966869_3639568397605510415_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEsrNFzN27dqzsy_zME3FJLO4S5EE2SDJs7hLkQTZIMmyuLCjwxfxhGHl3ohrvN5wRy4b4IEkFFecT53EkAICoi&_nc_ohc=tBHAx1QucogQ7kNvgFeTJvk&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=AVvJKYtZrQyjxQ7fnwggzet&oh=00_AYD3ME5bczzQTDshAHr8CWSPT63hDmIEQPj6sWh3TyFExg&oe=66F1037A' }}
                className="w-32 h-32 rounded-full mb-6"
            />
            <Text className="text-2xl font-bold mb-4">Hello, I'm Phan Lê Thành Công!</Text>
            <Text className="text-lg text-center mb-2">I am a third-year student at Ho Chi Minh City University of Technology and Education (HCMUTE), 2021 - Present</Text>
            <Text className="text-lg text-center mb-2">Major: Software Engineering</Text>
            <Text className="text-lg text-center mb-6">Current GPA: 3.51/4</Text>

            <Text className="text-lg font-semibold">Navigating to HomePage in {countdown} seconds...</Text>
        </View>
    );
};

export default IntroScreen;
