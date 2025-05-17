import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";

export default function PostScreen() {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <Header />
        <View className="flex-1 justify-center items-center">
          <ThemedText>Post Screen</ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
