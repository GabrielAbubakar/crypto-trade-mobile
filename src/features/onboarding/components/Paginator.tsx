import React from "react";
import { StyleSheet, View } from "react-native";

interface PaginatorProps {
  data: any[];
  currentIndex: number;
}

export const Paginator = ({ data, currentIndex }: PaginatorProps) => {
  return (
    <View style={styles.container}>
      {data.map((_, i) => (
        <View
          key={i.toString()}
          style={[
            styles.dot,
            {
              backgroundColor: i === currentIndex ? "#FFFFFF" : "#3F414E",
              opacity: i === currentIndex ? 1 : 0.3,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 10,
    marginHorizontal: 4,
  },
});
