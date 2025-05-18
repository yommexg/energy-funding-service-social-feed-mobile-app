import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Video } from "expo-av";

import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchPosts } from "@/redux/slices/feedSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { Post } from "@/utils/types/post";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { isLoading, posts, hasMore } = useSelector(
    (state: RootState) => state.feed
  );

  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (page > 1) {
      setIsFetchingMore(true);
      dispatch(fetchPosts({ page })).finally(() => setIsFetchingMore(false));
    }
  }, [page, dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchPosts({ page: 1 })).finally(() => {
      setPage(1);
      setRefreshing(false);
    });
  }, [dispatch]);

  const renderPost = ({ item }: { item: Post }) => (
    <ThemedView className="p-4 border-b border-gray-200 dark:border-gray-700">
      <ThemedText className="font-bold mb-2">{item.influencer_name}</ThemedText>
      <ThemedText className="mb-2">{item.post_content}</ThemedText>

      {item.post_type === "image" && item.media_url && (
        <Image
          source={{ uri: item.media_url }}
          style={{
            width: "100%",
            height: 300,
            borderRadius: 20,
          }}
          contentFit="cover"
          transition={1000}
        />
      )}

      {/* {item.post_type === "video" && item.media_url && (
        <Video
          source={{ uri: item.media_url }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 8,
            marginBottom: 8,
          }}
          resizeMode="cover"
          useNativeControls
          isLooping
        />
      )} */}

      <ThemedText className="text-xs text-gray-400">
        {item.hashtags.join(" ")} • {new Date(item.created_at).toLocaleString()}
      </ThemedText>
    </ThemedView>
  );

  const handleEndReached = useCallback(() => {
    if (!isLoading && !isFetchingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, isFetchingMore, hasMore]);

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <Header />
        {isLoading && page === 1 && <Spinner />}
        <FlashList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          estimatedItemSize={500}
          contentContainerStyle={{ paddingBottom: 100 }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.7}
          ListFooterComponent={isFetchingMore ? <Spinner /> : null}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </SafeAreaView>
    </ThemedView>
  );
}
