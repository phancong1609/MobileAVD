import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OtpForm from './screens/RegisterMail';
import RegistrationForm from './screens/RegistrationForm';
import Login  from './screens/Login';
import ForgotPassword  from './screens/ForgotPassword';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Register" component={RegistrationForm} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register Mail" component={OtpForm} />
            <Stack.Screen name="ForgetPassword" component={ForgotPassword} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default Navigation;
