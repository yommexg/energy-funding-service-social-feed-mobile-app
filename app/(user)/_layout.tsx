import { FontAwesome6 } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "red",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "500",
          },
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderTopWidth: 0,
            backgroundColor: "#1E1E1E",
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Artists",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome6
                name="users-line"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
