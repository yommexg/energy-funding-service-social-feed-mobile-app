import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { blurhash } from "@/constants/BlurHash";
import { primaryColor } from "@/constants/Colors";
import { fetchPosts } from "@/redux/slices/feedSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { Post } from "@/utils/types/post";

export default function ExploreScreen() {
  const dispatch = useAppDispatch();
  const { posts, isLoading, hasMore } = useSelector(
    (state: RootState) => state.feed
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">(
    "newest"
  );
  const [selectedType, setSelectedType] = useState<"all" | "video" | "image">(
    "all"
  );

  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts({ page }));
  }, [dispatch, page]);

  useEffect(() => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.post_content.toLowerCase().includes(query) ||
          post.hashtags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedType !== "all") {
      result = result.filter((post) => post.post_type === selectedType);
    }

    result = result.sort((a, b) => {
      if (sortOrder === "popular") {
        return b.likes_count - a.likes_count;
      } else if (sortOrder === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
    });

    setFilteredPosts(result);
  }, [searchQuery, posts, sortOrder, selectedType]);

  useEffect(() => {
    if (page > 1) {
      setIsFetchingMore(true);
      dispatch(fetchPosts({ page })).finally(() => setIsFetchingMore(false));
    }
  }, [page, dispatch]);

  const handleEndReached = useCallback(() => {
    if (!isLoading && !isFetchingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, isFetchingMore, hasMore]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchPosts({ page: 1 })).finally(() => {
      setPage(1);
      setRefreshing(false);
    });
  }, [dispatch]);

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <Header />

        <View className="p-4 flex-1">
          <TextInput
            placeholder="Search posts or hashtags"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="dark:bg-neutral-800 dark:text-white px-4 py-3 rounded-2xl 
            mb-4 border  dark:border-neutral-700"
            placeholderTextColor="#aaa"
          />
          <View className="rounded-lg mb-4">
            <View className="flex-row justify-between mb-6 pl-4  pr-6  pt-5">
              <TouchableOpacity
                onPress={() => setSortOrder("newest")}
                className="px-2 py-1 rounded-lg"
                style={{
                  backgroundColor:
                    sortOrder === "newest" ? primaryColor : "transparent",
                }}>
                <ThemedText
                  className={sortOrder === "newest" ? "font-bold" : ""}>
                  Newest
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSortOrder("oldest")}
                className="px-2 py-1 rounded-lg"
                style={{
                  backgroundColor:
                    sortOrder === "oldest" ? primaryColor : "transparent",
                }}>
                <ThemedText
                  className={sortOrder === "oldest" ? "font-bold" : ""}>
                  Oldest
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSortOrder("popular")}
                className="px-2 py-1 rounded-lg"
                style={{
                  backgroundColor:
                    sortOrder === "popular" ? primaryColor : "transparent",
                }}>
                <ThemedText
                  className={sortOrder === "popular" ? "font-bold" : ""}>
                  Popular
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between mb-4 px-4">
              <TouchableOpacity
                onPress={() => setSelectedType("all")}
                className="px-4 py-1 rounded-lg"
                style={{
                  backgroundColor:
                    selectedType === "all" ? primaryColor : "transparent",
                }}>
                <ThemedText
                  className={selectedType === "all" ? "font-bold" : ""}>
                  All
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedType("image")}
                className="px-4 py-1 rounded-lg"
                style={{
                  backgroundColor:
                    selectedType === "image" ? primaryColor : "transparent",
                }}>
                <ThemedText
                  className={selectedType === "image" ? "font-bold" : ""}>
                  Images
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedType("video")}
                className="px-4 py-1 rounded-lg"
                style={{
                  backgroundColor:
                    selectedType === "video" ? primaryColor : "transparent",
                }}>
                <ThemedText
                  className={selectedType === "video" ? "font-bold" : ""}>
                  Videos
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-1">
            <FlatList
              data={filteredPosts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ThemedView className="mb-4 border dark:border-green-100 px-4 py-6 rounded">
                  <View className="flex-row gap-2 items-center mb-2">
                    <Image
                      source={
                        item.influencer_pic
                          ? { uri: item.influencer_pic }
                          : require("@/assets/images/unknown_user.png")
                      }
                      contentFit="contain"
                      style={{ width: 25, height: 25, borderRadius: 40 }}
                      placeholder={blurhash}
                    />
                    <ThemedText className="font-bold">
                      {item.influencer_name}
                    </ThemedText>
                  </View>
                  <ThemedText className="mb-2">{item.post_content}</ThemedText>
                  <Text className="text-xs text-gray-500">
                    {item.hashtags.join(" ")}
                  </Text>
                </ThemedView>
              )}
              ListEmptyComponent={
                <ThemedText
                  className="text-center mt-20"
                  style={{ fontSize: 24 }}>
                  No results found.
                </ThemedText>
              }
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              // onEndReached={handleEndReached}
              // onEndReachedThreshold={0.7}
              refreshing={refreshing}
              onRefresh={onRefresh}
              // ListFooterComponent={
              //   isFetchingMore ? (
              //     <View className="mt-10">
              //       <Spinner />
              //     </View>
              //   ) : null
              // }
            />
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
