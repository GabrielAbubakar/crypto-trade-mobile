import { BackHeader, ProfileOptionCard, ScreenContainer, Skeleton } from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { useGetDevicesQuery } from "@/store/api/profileApi";
import type { IDevice } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

type DeviceListItem = { id: string; isSkeleton: true } | (IDevice & { isSkeleton?: false });

export default function DevicesScreen() {
  const { data: devices, isLoading, isError, refetch } = useGetDevicesQuery();

  const renderItem = ({ item }: { item: DeviceListItem }) => {
    if (item.isSkeleton) {
      return (
        <View style={styles.skeletonCard}>
          <View style={styles.skeletonLeft}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <View style={styles.skeletonText}>
              <Skeleton
                width={120}
                height={14}
                borderRadius={4}
                style={{ marginBottom: 8 }}
              />
              <Skeleton width={180} height={12} borderRadius={4} />
            </View>
          </View>
          <Skeleton width={48} height={24} borderRadius={12} />
        </View>
      );
    }

    return (
      <View style={styles.cardWrapper}>
        <ProfileOptionCard
          title={item.platform}
          description={`last seen ${new Date(item.lastSeenAt).toLocaleString()}`}
          icon={<Ionicons name="phone-portrait-outline" size={20} color="#5ED5A8" />}
        // rightElement={
        //   <View style={styles.currentBadge}>
        //     <BaseText variant="bold" size="xs" color="#5ED5A8">
        //       Current
        //     </BaseText>
        //   </View>
        // }
        />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.infoCard}>
        <Ionicons name="shield-checkmark" size={32} color="#5ED5A8" style={styles.infoIcon} />
        <BaseText variant="bold" color="#FFFFFF" style={styles.infoTitle}>
          No devices found
        </BaseText>
        <BaseText size="sm" color="#8594A6" style={styles.infoText}>
          New device alerts appear here after sign in from another device.
        </BaseText>
      </View>
    );
  };

  const listData: DeviceListItem[] = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => ({
        id: `skeleton-${index}`,
        isSkeleton: true,
      }));
    }
    return devices || [];
  }, [isLoading, devices]);

  return (
    <ScreenContainer style={styles.container} withPadding={true} scrollable={false}>
      <BackHeader title="Devices" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Registered devices for push notification and session awareness.
      </BaseText>

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flex: 1,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 40,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  currentBadge: {
    backgroundColor: "rgba(94, 213, 168, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: "rgba(94, 213, 168, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    padding: 24,
    alignItems: "center",
    marginTop: 20,
  },
  infoIcon: {
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
  },
  infoText: {
    color: "#8594A6",
    textAlign: "center",
    lineHeight: 20,
  },
  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#141820", // Assuming Colors.cardBg is similar to #141820
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  skeletonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  skeletonText: {
    flex: 1,
  },
});
