import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";

import { router } from "expo-router";
import React from "react";

interface ButtonProps {
  text: string;
  path?: Parameters<typeof router.push>[0];
  buttonStyle: StyleProp<ViewStyle>;
  buttonTextStyle: StyleProp<TextStyle>;
  onPress?: () => void;
}

export default function Button({
  path,
  text,
  buttonStyle,
  buttonTextStyle,
  onPress,
}: ButtonProps) {
  const handlePress = () => {
    if (path) {
      router.push(path);
    }

    if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable onPress={handlePress} style={buttonStyle}>
      <Text style={buttonTextStyle}>{text}</Text>
    </Pressable>
  );
}
