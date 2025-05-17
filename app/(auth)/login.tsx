import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootState, useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";

import { loginUser } from "@/redux/loginSlice";

import Spinner from "@/components/Spinner";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { primaryColor } from "@/constants/Colors";

export default function LoginScreen() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.login);

  const handleBackPress = () => {
    Alert.alert("Exit Social Feed App", "Are you sure you want to quit?", [
      { text: "Cancel", style: "cancel" },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );
      return () => subscription.remove();
    }, [])
  );

  const handleLogin = async () => {
    if (!user || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
    } else {
      await dispatch(loginUser(user, password));
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Login Error", error);
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
                entering={FadeInDown.duration(200).springify()}>
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
              <Animated.View
                entering={FadeInDown.delay(200).duration(300).springify()}>
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#aaa"
                  value={user}
                  onChangeText={setUser}
                  className="bg-neutral-800 text-white px-4 py-3 rounded-2xl mb-4 border border-neutral-700"
                />
              </Animated.View>

              {/* Password Input */}
              <Animated.View
                entering={FadeInDown.delay(300).duration(300).springify()}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  className="bg-neutral-800 text-white px-4 py-3 rounded-2xl mb-4 border border-neutral-700"
                />
              </Animated.View>

              {/* Login Button */}
              <Animated.View
                entering={FadeInDown.delay(400).duration(300).springify()}>
                <TouchableOpacity
                  className="rounded-2xl py-3 items-center mb-4"
                  style={{ backgroundColor: primaryColor }}
                  onPress={() => handleLogin()}
                  disabled={isLoading}>
                  <ThemedText className="text-white text-lg font-semibold">
                    Login
                  </ThemedText>
                </TouchableOpacity>
              </Animated.View>

              {/* Sign Up Prompt */}
              <Animated.View
                className="flex-row justify-center mt-6"
                entering={FadeInDown.delay(600).duration(300).springify()}>
                <Text className="text-neutral-400">Don’t have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/register")}>
                  <Text
                    className="font-semibold ml-2"
                    style={{ color: primaryColor }}>
                    Sign Up
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
