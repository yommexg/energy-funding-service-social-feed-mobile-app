import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, ViewToken } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchPosts } from "@/redux/slices/feedSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { Post } from "@/utils/types/post";

import { useVideoPlayer, VideoView } from "expo-video";

function PostVideoPlayer({
  uri,
  isPlaying,
}: {
  uri: string;
  isPlaying: boolean;
}) {
  const [playerStatus, setPlayerStatus] = useState("idle");

  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  });

  useEffect(() => {
    const subscription = player.addListener("statusChange", ({ status }) => {
      setPlayerStatus(status);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  useEffect(() => {
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, player]);

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
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
}

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchPosts({ page: 1 })).finally(() => {
      setPage(1);
      setRefreshing(false);
    });
  }, [dispatch]);

  // Viewability config & handler to control which video plays
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visibleVideo = viewableItems.find(
        (viewable) => viewable.item.post_type === "video" && viewable.isViewable
      );
      if (visibleVideo) {
        setPlayingVideoId(visibleVideo.item.id);
      } else {
        setPlayingVideoId(null);
      }
    }
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 75,
  });

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

      {item.post_type === "video" && item.media_url && (
        <PostVideoPlayer
          uri={item.media_url}
          isPlaying={playingVideoId === item.id}
        />
      )}

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
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig.current}
        />
      </SafeAreaView>
    </ThemedView>
  );
}
