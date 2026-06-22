import {
  BackHeader,
  ConfirmationModal,
  EditPriceAlertModal,
  ProfileOptionCard,
  ScreenContainer,
  SwipeableRow,
} from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import {
  useDeletePriceAlertMutation,
  useGetPriceAlertsQuery,
  useUpdatePriceAlertMutation,
} from "@/store";
import type { IPriceAlert } from "@/types";
import { showErrorToast, showSuccessToast } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

export default function PriceAlertsScreen() {
  const { data: alerts = [], isLoading } = useGetPriceAlertsQuery();
  const [deletePriceAlert, { isLoading: isDeleting }] =
    useDeletePriceAlertMutation();
  const [updatePriceAlert, { isLoading: isUpdating }] =
    useUpdatePriceAlertMutation();

  const [selectedAlert, setSelectedAlert] = useState<IPriceAlert | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [alertToEdit, setAlertToEdit] = useState<IPriceAlert | null>(null);


  const handleAlertPress = (alert: IPriceAlert) => {
    setSelectedAlert(alert);
    setModalVisible(true);
  };

  const handleToggleAlert = async (alert: IPriceAlert) => {
    try {
      await updatePriceAlert({
        alertId: alert.id,
        body: { isActive: !alert.isActive },
      }).unwrap();
      showSuccessToast(
        `Alert for ${alert.assetSymbol} ${!alert.isActive ? "activated" : "paused"}`,
      );
    } catch {
      // console.error("Failed to update price alert:", err);
      showErrorToast("Failed to update price alert");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedAlert) {
      try {
        await deletePriceAlert(selectedAlert.id).unwrap();
        showSuccessToast(`Alert for ${selectedAlert.assetSymbol} removed`);
      } catch {
        // console.error("Failed to delete price alert:", err);
        showErrorToast("Failed to delete price alert");
      }
    }
    setModalVisible(false);
    setSelectedAlert(null);
  };

  const handleEditPress = (alert: IPriceAlert) => {
    setAlertToEdit(alert);
    setEditModalVisible(true);
  };

  const handleEditConfirm = async (updatedFields: {
    targetPriceUsd: number;
    direction: "above" | "below" | string;
    isActive: boolean;
  }) => {
    if (alertToEdit) {
      try {
        await updatePriceAlert({
          alertId: alertToEdit.id,
          body: updatedFields,
        }).unwrap();
        showSuccessToast(`Alert for ${alertToEdit.assetSymbol} updated`);
      } catch {
        showErrorToast("Failed to update price alert");
      }
    }
    setEditModalVisible(false);
    setAlertToEdit(null);
  };


  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusBadge = (status: "on" | "off") => {
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

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.scrollList}
        ListEmptyComponent={
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
        }
        renderItem={({ item: alert }) => {
          const status: "on" | "off" = alert.isActive ? "on" : "off";
          const description =
            status === "off" ? "Paused" : "Active - push notification on";
          const formattedPrice = formatPrice(alert.targetPriceUsd);

          return (
            <SwipeableRow
              onEdit={() => handleEditPress(alert)}
              onDelete={() => handleAlertPress(alert)}
            >
              <ProfileOptionCard
                title={`${alert.assetSymbol} ${alert.direction} ${formattedPrice}`}
                description={description}
                onPress={() => handleToggleAlert(alert)}
                icon={
                  <Ionicons
                    name="trending-up-outline"
                    size={20}
                    color={
                      status === "off" ? Colors.textSecondary : Colors.primary
                    }
                  />
                }
                iconBgColor={
                  status === "off" ? Colors.iconBgInactive : Colors.iconBgActive
                }
                rightElement={getStatusBadge(status)}
              />
            </SwipeableRow>
          );
        }}
      />

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

      {/* Edit Price Alert Modal */}
      <EditPriceAlertModal
        visible={editModalVisible}
        alert={alertToEdit}
        onClose={() => {
          setEditModalVisible(false);
          setAlertToEdit(null);
        }}
        onConfirm={handleEditConfirm}
        isLoading={isUpdating}
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
    gap: 12,
  },
  list: {},
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
