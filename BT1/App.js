// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IntroScreen from './src/screens/IntroScreen';
import HomePage from './src/screens/HomePage';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="IntroScreen"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="IntroScreen" component={IntroScreen} />
                <Stack.Screen name="HomePage" component={HomePage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
