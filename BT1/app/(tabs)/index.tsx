import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomePage() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to the Homepage!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    text: {
        fontSize: 20,
    },
});
