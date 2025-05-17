import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function WelcomeScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center">
      <ThemedText className="text-lg font-bold">
        Welcome to the Energy fund Me Social Feed App!
      </ThemedText>
    </ThemedView>
  );
}
