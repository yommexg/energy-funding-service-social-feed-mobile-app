import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function UserLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={({ route }) => {
        let iconName: keyof typeof Ionicons.glyphMap = "home";
        let tabBarLabel = "";

        switch (route.name) {
          case "index":
            iconName = "home";
            tabBarLabel = "Home";
            break;
          case "explore":
            iconName = "search";
            tabBarLabel = "Explore";
            break;
          case "post":
            iconName = "add-circle";
            tabBarLabel = "Post";
            break;

          case "profile":
            iconName = "settings";
            tabBarLabel = "Profile";
            break;
        }

        return {
          headerShown: false,
          tabBarLabel,
          tabBarActiveTintColor: themeColors.tabIconActive,
          tabBarInactiveTintColor: themeColors.tabIconInactive,
          tabBarStyle: {
            backgroundColor: themeColors.tabBackground,
            borderTopWidth: 0,
          },
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          ),
        };
      }}
    />
  );
}
