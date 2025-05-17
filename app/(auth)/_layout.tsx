import { Stack, Tabs } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack>
      <Tabs.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
