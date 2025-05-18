import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function UserLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tabIconActive,
        tabBarInactiveTintColor: themeColors.tabIconInactive,
        tabBarStyle: {
          backgroundColor: themeColors.tabBackground,
          borderTopWidth: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="search"
              size={size}
              color={color}
            />
          ),
          title: "Search",
          headerShadowVisible: true,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          tabBarLabel: "Post",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="add-circle"
              size={size}
              color={color}
            />
          ),
          title: "Add Post",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings"
              size={size}
              color={color}
            />
          ),
          title: "Account Settings",
        }}
      />
    </Tabs>
  );
}
