import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import VideoPlayer from "@/components/VideoPlayer";
import { primaryColor } from "@/constants/Colors";

export default function PostScreen() {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<{
    uri: string;
    type: "image" | "video";
  } | null>(null);

  const pickMedia = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      const picked = result.assets[0];
      setMedia({ uri: picked.uri, type: picked.type as "image" | "video" });
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && !media) {
      alert("Please add some content before posting.");
      return;
    }
    console.log("Post submitted:", { text, media });
    setText("");
    setMedia(null);
  };

  return (
    <ThemedView className="flex-1 px-4">
      <SafeAreaView className="flex-1">
        <ThemedText className="text-2xl font-bold mb-4">
          Create a Post
        </ThemedText>

        <TextInput
          multiline
          placeholder="What's on your mind?"
          value={text}
          onChangeText={setText}
          className="min-h-[100px] px-4 py-3 rounded-xl mb-4 dark:bg-neutral-800 dark:text-white border dark:border-neutral-700"
          placeholderTextColor="#999"
          textAlignVertical="top"
        />

        <TouchableOpacity
          onPress={pickMedia}
          className="mb-4 px-4 py-3 rounded-xl border dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <ThemedText className="text-center">Pick Image or Video</ThemedText>
        </TouchableOpacity>

        {media && (
          <View className="mb-4 rounded-xl overflow-hidden">
            {media.type === "image" ? (
              <Image
                source={{ uri: media.uri }}
                style={{ width: "100%", height: 250, borderRadius: 12 }}
                resizeMode="cover"
              />
            ) : (
              <VideoPlayer
                uri={media.uri}
                isPlaying={false}
              />
            )}
          </View>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          className="mt-10 py-3 rounded-xl"
          style={{ backgroundColor: primaryColor }}>
          <ThemedText className="text-center font-bold text-white">
            Post
          </ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
  );
}
