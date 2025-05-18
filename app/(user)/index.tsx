import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View, ViewToken } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchPosts } from "@/redux/slices/feedSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { Post } from "@/utils/types/post";

import { blurhash } from "@/constants/BlurHash";
import { useVideoPlayer, VideoView } from "expo-video";

// ✅ Video player component with memoization
const PostVideoPlayer = memo(function PostVideoPlayer({
  uri,
  isPlaying,
}: {
  uri: string;
  isPlaying: boolean;
}) {
  const [playerStatus, setPlayerStatus] = useState("idle");

  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    if (isPlaying) player.play();
    else player.pause();
  });

  useEffect(() => {
    const sub = player.addListener("statusChange", ({ status }) => {
      setPlayerStatus(status);
    });
    return () => sub.remove();
  }, [player]);

  // useEffect(() => {
  //   if (isPlaying) player.play();
  //   else player.pause();
  // }, [isPlaying, player]);

  return (
    <View
      style={{
        width: "100%",
        height: 300,
        borderRadius: 20,
        overflow: "hidden",
      }}>
      <VideoView
        style={{ width: "100%", height: "100%" }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      {playerStatus !== "readyToPlay" && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: 20,
          }}>
          <ActivityIndicator
            size="large"
            color="#fff"
          />
        </View>
      )}
    </View>
  );
});

// ✅ Memoized post item
const PostItem = memo(function PostItem({
  item,
  isPlaying,
}: {
  item: Post;
  isPlaying: boolean;
}) {
  return (
    <ThemedView className="p-4 border-b border-gray-200 dark:border-gray-700">
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
        <ThemedText className="font-bold">{item.influencer_name}</ThemedText>
      </View>

      <ThemedText className="mb-2">{item.post_content}</ThemedText>

      {item.post_type === "image" && item.media_url && (
        <Image
          source={{ uri: item.media_url }}
          style={{ width: "100%", height: 300, borderRadius: 20 }}
          contentFit="cover"
          transition={1000}
        />
      )}

      {item.post_type === "video" && item.media_url && (
        <PostVideoPlayer
          uri={item.media_url}
          isPlaying={isPlaying}
        />
      )}

      <ThemedText className="text-xs text-gray-400 mt-2">
        👍{item.likes_count} {item.hashtags.join(" ")} •{" "}
        {new Date(item.created_at).toLocaleString()}
      </ThemedText>
    </ThemedView>
  );
});

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { isLoading, posts, hasMore } = useSelector(
    (state: RootState) => state.feed
  );

  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPosts({ page: 1 }));
  }, [dispatch]);

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

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visibleVideo = viewableItems.find(
        (v) => v.item.post_type === "video" && v.isViewable
      );
      setPlayingVideoId(visibleVideo?.item.id ?? null);
    }
  );

  const viewabilityConfig = useMemo(
    () => ({ itemVisiblePercentThreshold: 75 }),
    []
  );

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <PostItem
        item={item}
        isPlaying={playingVideoId === item.id}
      />
    ),
    [playingVideoId]
  );

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
          ListFooterComponent={
            isFetchingMore ? (
              <View className="mt-10">
                <Spinner />
              </View>
            ) : null
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig}
        />
      </SafeAreaView>
    </ThemedView>
  );
}
