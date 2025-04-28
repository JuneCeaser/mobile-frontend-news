import React, { useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen";
import VerifyOTP from "./screens/VerifyOTP";
import BottomTabNavigator from "./BottomTabNavigator";
import { AuthProvider } from "./AuthContext";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = useRef();

  return (
    <AuthProvider navigationRef={navigationRef}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VerifyOTP"
            component={VerifyOTP}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeTabs"
            component={BottomTabNavigator}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}