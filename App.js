import React, {useEffect, useCallback} from "react";
import Navigation from "./navigation";
import "react-native-gesture-handler";
import {useFonts} from 'expo-font';
import { NavigationContainer } from "@react-navigation/native"
import { useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

const {DefaultTheme, DarkTheme} = require("./colors");

let customFonts = {
  "Abril Fatface Italic": require("./assets/fonts/Abril_Fatface_Italic.otf"),
  "BarlowSCSB": require("./assets/fonts/BarlowSemiCondensed-SemiBold.ttf"),
  "BarlowSCR": require("./assets/fonts/BarlowSemiCondensed-Regular.ttf"),
  "BarlowSCI": require("./assets/fonts/BarlowSemiCondensed-Italic.ttf"),
  "BarlowSCT":  require("./assets/fonts/BarlowSemiCondensed-Thin.ttf")
}

SplashScreen.preventAutoHideAsync();

export default function App(props) {
  const scheme = useColorScheme();
  const [fontsLoaded] = useFonts(customFonts);
  

  const handleOnLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync(); 
    }
  }, [fontsLoaded]);

  useEffect(() => {
    handleOnLayout();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer 
        theme={scheme == "light" ? DefaultTheme : DarkTheme}>
        <Navigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
