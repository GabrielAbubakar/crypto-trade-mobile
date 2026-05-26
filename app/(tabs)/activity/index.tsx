import type { HeaderButtonProps } from "@/components";
import {
  ActivityItemRow,
  ActivityQuickAction,
  BaseText,
  ScreenContainer,
  UserHeader,
} from "@/components";
import { activitiesData, Colors, quickActions } from "@/constants";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

// Import Main Header Icons
import NotificationIcon from "@/assets/icons/main/notification.svg";
import QrIcon from "@/assets/icons/main/scanner.svg";
import SearchIcon from "@/assets/icons/main/search.svg";

const headerButtons: HeaderButtonProps[] = [
  {
    link: "/home/search",
    icon: SearchIcon,
  },
  {
    link: "/home/qr-scan",
    icon: QrIcon,
  },
  {
    link: "/home/notifications",
    icon: NotificationIcon,
  },
];

export default function ActivityScreen() {
  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      {/* Header */}
      <UserHeader userButtons={headerButtons} />

      {/* Fast Actions list */}
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action) => (
          <ActivityQuickAction key={action.id} action={action} />
        ))}
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <BaseText variant="bold" style={styles.sectionTitle}>
          Recent Activity
        </BaseText>
      </View>

      {/* Recent Activity List */}
      <FlatList
        data={activitiesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityItemRow activity={item} />}
        contentContainerStyle={styles.activitiesContainer}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  quickActionsContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    gap: 0,
    borderRadius: 16,
    backgroundColor: "#161C22"
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  activitiesContainer: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 140, // Space for floating bottom tab
  },
});
