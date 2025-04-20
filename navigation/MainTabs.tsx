import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"

import DashboardScreen from "../screens/DashboardScreen"
import CredentialsScreen from "../screens/CredentialsScreen"
import VerifyScreen from "../screens/VerifyScreen"
import SettingsScreen from "../screens/SettingsScreen"
import IssuerScreen from "../screens/IssuerScreen"

// Define the type for the tab navigator
type TabParamList = {
  Dashboard: undefined
  Credentials: undefined
  Verify: undefined
  Settings: undefined
  Issuer: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Credentials") {
            iconName = focused ? "document-text" : "document-text-outline"
          } else if (route.name === "Verify") {
            iconName = focused ? "qr-code" : "qr-code-outline"
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline"
          } else if (route.name === "Issuer") {
            iconName = focused ? "ribbon" : "ribbon-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#6d28d9",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Credentials" component={CredentialsScreen} options={{ title: "My Credentials" }} />
      <Tab.Screen name="Verify" component={VerifyScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Issuer" component={IssuerScreen} options={{ title: "Issuer Portal" }} />
    </Tab.Navigator>
  )
}
