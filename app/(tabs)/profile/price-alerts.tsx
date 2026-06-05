import {
  BackHeader,
  ConfirmationModal,
  ProfileOptionCard,
  ScreenContainer,
} from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { useDeletePriceAlertMutation, useGetPriceAlertsQuery } from "@/store";
import type { IPriceAlert } from "@/types";
import { showErrorToast, showSuccessToast } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function PriceAlertsScreen() {
  const { data: alerts = [], isLoading } = useGetPriceAlertsQuery();
  const [deletePriceAlert, { isLoading: isDeleting }] =
    useDeletePriceAlertMutation();

  const [selectedAlert, setSelectedAlert] = useState<IPriceAlert | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAlertPress = (alert: IPriceAlert) => {
    setSelectedAlert(alert);
    setModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAlert) {
      try {
        await deletePriceAlert(selectedAlert.id).unwrap();
        showSuccessToast(`Alert for ${selectedAlert.assetSymbol} removed`);
      } catch (err) {
        showErrorToast("Failed to delete price alert");
      }
    }
    setModalVisible(false);
    setSelectedAlert(null);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusBadge = (status: "on" | "off" | "read") => {
    switch (status) {
      case "on":
        return (
          <View style={styles.badgeOn}>
            <BaseText variant="bold" size="xs" color={Colors.primary}>
              On
            </BaseText>
          </View>
        );
      case "off":
        return (
          <View style={styles.badgeOff}>
            <BaseText variant="bold" size="xs" color={Colors.error}>
              Off
            </BaseText>
          </View>
        );
      case "read":
        return (
          <View style={styles.badgeRead}>
            <BaseText variant="bold" size="xs" color={Colors.textSecondary}>
              Read
            </BaseText>
          </View>
        );
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer style={styles.container} withPadding={true}>
        <BackHeader title="Price alerts" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Price alerts" />

      <BaseText color={Colors.textSecondary} style={styles.subtitle}>
        Create, edit, pause, or delete market alerts.
      </BaseText>

      <ScrollView contentContainerStyle={styles.scrollList}>
        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color={Colors.textSecondary}
            />
            <BaseText color={Colors.textSecondary} style={styles.emptyText}>
              No price alerts set. Create alerts from the asset details screen.
            </BaseText>
          </View>
        ) : (
          alerts.map((alert) => {
            const status: "on" | "off" | "read" = alert.isActive
              ? alert.triggeredAt
                ? "read"
                : "on"
              : "off";
            const description =
              status === "read"
                ? "Triggered"
                : status === "off"
                  ? "Paused"
                  : "Active - push notification on";
            const formattedPrice = formatPrice(alert.targetPriceUsd);

            return (
              <ProfileOptionCard
                key={alert.id}
                title={`${alert.assetSymbol} ${alert.direction} ${formattedPrice}`}
                description={description}
                icon={
                  <Ionicons
                    name="trending-up-outline"
                    size={20}
                    color={status === "off" ? Colors.textSecondary : Colors.primary}
                  />
                }
                iconBgColor={status === "off" ? Colors.iconBgInactive : Colors.iconBgActive}
                rightElement={getStatusBadge(status)}
                onLongPress={() => handleAlertPress(alert)}
              />
            );
          })
        )}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={modalVisible}
        title="Delete alert?"
        message={
          selectedAlert
            ? `This removes the ${selectedAlert.assetSymbol} ${selectedAlert.direction} ${formatPrice(selectedAlert.targetPriceUsd)} alert from your list.`
            : "Are you sure you want to delete this alert?"
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        showIcon={false}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setModalVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  scrollList: {
    paddingBottom: 40,
  },
  badgeOn: {
    backgroundColor: "rgba(94, 213, 168, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeOff: {
    backgroundColor: "rgba(255, 77, 77, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeRead: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 32,
  },
});
