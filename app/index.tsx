import { router } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text onPress={() => router.push("/(tabs)/home")}>
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
