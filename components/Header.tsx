import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

import { ThemedText } from "@/components/ThemedText";
import { blurhash } from "@/constants/BlurHash";
import { primaryColor } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RootState } from "@/redux/store";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.login);
  const colorScheme = useColorScheme();

  const backgroundHeaderColor = colorScheme === "dark" ? "#00050F" : "#FFFFFF";

  return (
    <View
      className="px-5 pt-16 py-4 rounded-b-2xl bg-transparent shadow-black shadow-opacity-30 shadow-xl shadow-offset-y-1 flex-row items-center justify-between"
      style={{
        backgroundColor: backgroundHeaderColor,
      }}>
      {/* Left Section */}
      <View className="flex-row items-center gap-4">
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 60, height: 60, borderRadius: 4 }}
          contentFit="contain"
          placeholder={blurhash}
        />

        <View>
          <Text
            className="text-xl font-bold tracking-wide"
            style={{ color: primaryColor }}>
            Energy Funding Service
          </Text>
          <ThemedText
            className="itali mt-1 max-w-[100px] capitalize"
            style={{ fontSize: 12 }}
            numberOfLines={1}
            ellipsizeMode="tail">
            Welcome, {user?.username ?? "User"}
          </ThemedText>
        </View>
      </View>

      {/* Right Section */}
      <View className="flex-row items-center space-x-5">
        <Image
          source={
            user && user.imageUrl
              ? { uri: user.imageUrl }
              : require("@/assets/images/unknown_user.png")
          }
          contentFit="contain"
          style={{ width: 50, height: 50, borderRadius: 40 }}
          placeholder={blurhash}
        />
      </View>
    </View>
  );
};

export default Header;
