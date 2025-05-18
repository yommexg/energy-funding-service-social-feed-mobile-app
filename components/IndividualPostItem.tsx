import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { blurhash } from "@/constants/BlurHash";
import { Post } from "@/utils/types/post";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { memo, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type PostItemProps = {
  item: Post;
  isPlaying: boolean;
};

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

const IndividualPostItem = memo(function IndividualPostItem({
  item,
  isPlaying,
}: PostItemProps) {
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

export default IndividualPostItem;
