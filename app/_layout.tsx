import { Stack } from "expo-router";
import React from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="main_screen" options={{title: "Home"}} />
      <Stack.Screen name="ingredient_list" options={{title: "List"}} />
    </Stack>
  );
}