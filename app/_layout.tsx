import { Stack } from "expo-router";
import React from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="main_screen" options={{title: "Home"}} />
      <Stack.Screen name="tabs/meals/[mealId]" options={{title: "List"}} />
    </Stack>
  );
}