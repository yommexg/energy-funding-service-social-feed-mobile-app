import { useVideoPlayer, VideoView } from "expo-video";
import { memo, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type VideoPlayerProps = {
  uri: string;
  isPlaying: boolean;
};

const VideoPlayer = memo(function VideoPlayer({
  uri,
  isPlaying,
}: VideoPlayerProps) {
  const [playerStatus, setPlayerStatus] = useState("idle");

  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
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

export default VideoPlayer;
