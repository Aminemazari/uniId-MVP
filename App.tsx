import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import WelcomeScreen from "./screens/WelcomeScreen"
import LoginScreen from "./screens/LoginScreen"
import MainTabs from "./navigation/MainTabs"
import CredentialDetailScreen from "./screens/CredentialDetailScreen"
import VerifyScreen from "./screens/VerifyScreen"

// Define the type for the navigation stack
export type RootStackParamList = {
  Welcome: undefined
  Login: undefined
  MainTabs: undefined
  CredentialDetail: { credential: any }
  Verify: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="CredentialDetail"
              component={CredentialDetailScreen}
              options={{ title: "Credential Details" }}
            />
            <Stack.Screen name="Verify" component={VerifyScreen} options={{ title: "Verify Credential" }} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
