import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { primaryColor } from "@/constants/Colors";
import { logoutUser } from "@/redux/slices/loginSlice";
import { useAppDispatch } from "@/redux/store";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="p-4">
            {/* Edit Profile */}
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="gray"
              />
              <ThemedText className="ml-4 text-base">Edit Profile</ThemedText>
            </TouchableOpacity>

            {/* Change Password */}
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <Feather
                name="lock"
                size={24}
                color="gray"
              />
              <ThemedText className="ml-4 text-base">
                Change Password
              </ThemedText>
            </TouchableOpacity>

            {/* Privacy Settings */}
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <MaterialIcons
                name="privacy-tip"
                size={24}
                color="gray"
              />
              <ThemedText className="ml-4 text-base">
                Privacy Settings
              </ThemedText>
            </TouchableOpacity>

            {/* Notification Preferences */}
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="gray"
              />
              <ThemedText className="ml-4 text-base">
                Notification Preferences
              </ThemedText>
            </TouchableOpacity>

            {/* Help & Support */}
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <Ionicons
                name="help-circle-outline"
                size={24}
                color="gray"
              />
              <ThemedText className="ml-4 text-base">Help & Support</ThemedText>
            </TouchableOpacity>

            {/* About */}
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="gray"
              />
              <ThemedText className="ml-4 text-base">About</ThemedText>
            </TouchableOpacity>
          </View>

          <View className="p-4 mt-10">
            <TouchableOpacity
              onPress={handleLogout}
              style={{ backgroundColor: primaryColor }}
              className="py-3 rounded-lg items-center">
              <ThemedText className="text-white font-semibold">
                Log Out
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
