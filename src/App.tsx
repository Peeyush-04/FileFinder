import { StatusBar } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Screens
import HomeScreen from "./screens/HomeScreen"
import SettingsScreen from "./screens/SettingsScreen"

// Context
import { ThemeProvider, useTheme } from "./contexts/ThemeContext"

const Stack = createStackNavigator()

const AppContent = () => {
  const { isDark } = useTheme()

  // Configure navigation themes
  const navigationTheme = isDark ? DarkTheme : DefaultTheme

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#121212" : "#f5f5f5"}
      />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: isDark ? "#121212" : "#f5f5f5" },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
