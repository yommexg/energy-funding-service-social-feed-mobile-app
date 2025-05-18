import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View, ViewToken } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import Header from "@/components/Header";
import IndividualPostItem from "@/components/IndividualPostItem";
import Spinner from "@/components/Spinner";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Fetch posts on page change or filters applied
  useEffect(() => {
    setIsFetchingMore(true);

    // Pass sort/filter params to thunk if you update feedSlice to accept them (optional)
    dispatch(fetchPosts({ page })).finally(() => setIsFetchingMore(false));
  }, [page, dispatch]);

  // Filter & search on posts from Redux store
  useEffect(() => {
    let result = [...posts];

    // Search by content or hashtags
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.post_content.toLowerCase().includes(query) ||
          post.hashtags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by type if not 'all'
    if (selectedType !== "all") {
      result = result.filter((post) => post.post_type === selectedType);
    }

    // Sort locally if needed (or sort on backend/feedSlice)
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
  }, [posts, searchQuery, selectedType, sortOrder]);

  // Handle loading more when user scrolls near bottom
  const handleEndReached = useCallback(() => {
    if (!isLoading && !isFetchingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, isFetchingMore, hasMore]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchPosts({ page: 1 })).finally(() => {
      setPage(1);
      setRefreshing(false);
    });
  }, [dispatch]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visibleVideo = viewableItems.find(
        (v) => v.item.post_type === "video" && v.isViewable
      );
      setPlayingVideoId(visibleVideo?.item.id ?? null);
    }
  );

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <IndividualPostItem
        item={item}
        isPlaying={playingVideoId === item.id}
      />
    ),
    [playingVideoId]
  );

  const viewabilityConfig = useMemo(
    () => ({ itemVisiblePercentThreshold: 75 }),
    []
  );

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <Header />

        <View className="flex-1">
          <TextInput
            placeholder="Search posts or hashtags"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="mx-4 dark:bg-neutral-800 dark:text-white px-4 py-3 rounded-2xl mb-4 border dark:border-neutral-700"
            placeholderTextColor="#aaa"
          />

          {/* Sorting Buttons */}
          <View className="rounded-lg mb-4 px-4">
            <View className="flex-row justify-between mb-6 pl-4 pr-6 pt-5">
              {["newest", "oldest", "popular"].map((order) => (
                <TouchableOpacity
                  key={order}
                  onPress={() => setSortOrder(order as typeof sortOrder)}
                  className="px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor:
                      sortOrder === order ? primaryColor : "transparent",
                  }}>
                  <ThemedText
                    className={sortOrder === order ? "font-bold" : ""}>
                    {order.charAt(0).toUpperCase() + order.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            {/* Type Filter Buttons */}
            <View className="flex-row justify-between mb-4 px-4">
              {["all", "image", "video"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(type as typeof selectedType)}
                  className="px-4 py-1 rounded-lg"
                  style={{
                    backgroundColor:
                      selectedType === type ? primaryColor : "transparent",
                  }}>
                  <ThemedText
                    className={selectedType === type ? "font-bold" : ""}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Posts List */}
          <View className="flex-1">
            <FlashList
              data={filteredPosts}
              keyExtractor={(item, index) =>
                item.id?.toString() || `post-${index}`
              }
              renderItem={renderPost}
              ListEmptyComponent={
                <ThemedText
                  className="text-center mt-20"
                  style={{ fontSize: 24 }}>
                  No results found.
                </ThemedText>
              }
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.1}
              refreshing={refreshing}
              onRefresh={onRefresh}
              ListFooterComponent={
                isFetchingMore ? (
                  <View className="mt-10">
                    <Spinner />
                  </View>
                ) : null
              }
              estimatedItemSize={20}
              onViewableItemsChanged={onViewableItemsChanged.current}
              viewabilityConfig={viewabilityConfig}
            />
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
