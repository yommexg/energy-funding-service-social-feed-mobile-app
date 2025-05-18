import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchPosts } from "@/redux/slices/feedSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const { isLodaing, posts } = useSelector((state: RootState) => state.feed);

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <Header />
        <View className="flex-1 justify-center items-center">
          <ThemedText>Home Screen</ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
