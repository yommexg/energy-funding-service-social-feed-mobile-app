import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, ViewToken } from "react-native";
import { useSelector } from "react-redux";

import Header from "@/components/Header";
import IndividualPostItem from "@/components/IndividualPostItem";
import Spinner from "@/components/Spinner";
import { ThemedView } from "@/components/ThemedView";
import { fetchPosts } from "@/redux/slices/feedSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { Post } from "@/utils/types/post";

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
      <IndividualPostItem
        item={item}
        isPlaying={playingVideoId === item.id}
      />
    ),
    [playingVideoId]
  );

  return (
    <ThemedView className="flex-1">
      {/* <SafeAreaView className="flex-1"> */}
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
      {/* </SafeAreaView> */}
    </ThemedView>
  );
}
