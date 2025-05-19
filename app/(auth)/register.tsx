import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import Spinner from "@/components/Spinner";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { primaryColor } from "@/constants/Colors";
import { registerUser } from "@/redux/slices/registerSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";

export default function RegisterScreen() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useAppDispatch();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.register
  );

  const handleRegister = async () => {
    if (!user || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
    } else if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
    } else if (user && password) {
      await dispatch(
        registerUser({
          username: user,
          password,
        })
      );
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Registration Error", error);
    }
  }, [error]);

  return (
    <ThemedView className="flex-1">
      {isLoading && <Spinner />}
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
            <ThemedView className="flex-1 justify-center px-6">
              {/* Logo and Title */}
              <Animated.View
                className="items-center mb-10"
                entering={FadeInDown.springify()}>
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={{ width: 144, height: 144, marginBottom: 16 }}
                  contentFit="contain"
                />
                <ThemedText className="text-2xl font-bold italic">
                  Social Feed App
                </ThemedText>
              </Animated.View>

              {/* Username Input */}
              <Animated.View entering={FadeInDown.delay(200).springify()}>
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#aaa"
                  value={user}
                  onChangeText={setUser}
                  className="dark:bg-neutral-800 dark:text-white px-4 py-3 rounded-2xl mb-4 border dark:border-neutral-700"
                />
              </Animated.View>

              {/* Password Input */}
              <Animated.View entering={FadeInDown.delay(300).springify()}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  className="dark:bg-neutral-800 dark:text-white px-4 py-3 rounded-2xl mb-4 border dark:border-neutral-700"
                />
              </Animated.View>

              {/* Confirm Password Input */}
              <Animated.View entering={FadeInDown.delay(400).springify()}>
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="dark:bg-neutral-800 dark:text-white px-4 py-3 rounded-2xl mb-4 border dark:border-neutral-700"
                />
              </Animated.View>

              {/* Register Button */}
              <Animated.View entering={FadeInDown.delay(500).springify()}>
                <TouchableOpacity
                  onPress={handleRegister}
                  style={{ backgroundColor: primaryColor }}
                  className="rounded-2xl py-3 items-center mb-4">
                  <ThemedText className="text-white text-lg font-semibold">
                    Register
                  </ThemedText>
                </TouchableOpacity>
              </Animated.View>

              {/* Login Link */}
              <Animated.View
                className="flex-row justify-center mt-6"
                entering={FadeInDown.delay(600).springify()}>
                <Text className="text-neutral-400">
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text
                    className="font-semibold ml-2"
                    style={{ color: primaryColor }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}
