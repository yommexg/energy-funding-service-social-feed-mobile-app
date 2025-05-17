import React from "react";
import { ActivityIndicator, View } from "react-native";

const Spinner: React.FC = () => {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center">
      <View className="absolute inset-0 bg-black opacity-40" />
      <ActivityIndicator
        size="large"
        color="#fff"
      />
    </View>
  );
};

export default Spinner;
