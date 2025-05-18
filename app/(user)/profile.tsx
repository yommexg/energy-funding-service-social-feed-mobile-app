import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { primaryColor } from "@/constants/Colors";
import { logoutUser } from "@/redux/slices/loginSlice";
import { useAppDispatch } from "@/redux/store";

const ProfileItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700">
    {icon}
    <ThemedText className="ml-4 text-base">{label}</ThemedText>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <View>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View className="p-4">
              <ProfileItem
                icon={
                  <Ionicons
                    name="person-circle-outline"
                    size={24}
                    color="gray"
                  />
                }
                label="Edit Profile"
              />
              <ProfileItem
                icon={
                  <Feather
                    name="lock"
                    size={24}
                    color="gray"
                  />
                }
                label="Change Password"
              />
              <ProfileItem
                icon={
                  <Ionicons
                    name="moon"
                    size={24}
                    color="gray"
                  />
                }
                label="Appearance"
              />
              <ProfileItem
                icon={
                  <MaterialIcons
                    name="privacy-tip"
                    size={24}
                    color="gray"
                  />
                }
                label="Privacy Settings"
              />
              <ProfileItem
                icon={
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="gray"
                  />
                }
                label="Notification Preferences"
              />
              <ProfileItem
                icon={
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="gray"
                  />
                }
                label="Help & Support"
              />
              <ProfileItem
                icon={
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color="gray"
                  />
                }
                label="About"
              />
            </View>
          </ScrollView>

          <View className="p-4">
            <TouchableOpacity
              onPress={handleLogout}
              style={{ backgroundColor: primaryColor }}
              className="py-3 rounded-lg items-center">
              <ThemedText className="text-white font-semibold">
                Log Out
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
