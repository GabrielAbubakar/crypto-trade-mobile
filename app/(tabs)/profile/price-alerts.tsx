import { BackHeader, BaseButton, ConfirmationModal, ProfileOptionCard, ScreenContainer } from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { showSuccessToast } from "@/utils";

interface PriceAlertItem {
  id: string;
  symbol: string;
  condition: string;
  price: string;
  status: "on" | "off" | "read";
  description: string;
}

export default function PriceAlertsScreen() {
  const initialAlerts: PriceAlertItem[] = [
    {
      id: "1",
      symbol: "BTC",
      condition: "above",
      price: "$72,000",
      status: "on",
      description: "Active - push notification on"
    },
    {
      id: "2",
      symbol: "ETH",
      condition: "below",
      price: "$2,900",
      status: "off",
      description: "Paused"
    },
    {
      id: "3",
      symbol: "SOL",
      condition: "above",
      price: "$170",
      status: "read",
      description: "Triggered today"
    }
  ];

  const [alerts, setAlerts] = useState<PriceAlertItem[]>(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<PriceAlertItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateAlert = () => {
    // Add a new mock alert
    const newAlert: PriceAlertItem = {
      id: Date.now().toString(),
      symbol: "BNB",
      condition: "above",
      price: "$600",
      status: "on",
      description: "Active - push notification on"
    };
    setAlerts([newAlert, ...alerts]);
    showSuccessToast("Price alert for BNB above $600 created!");
  };

  const handleAlertPress = (alert: PriceAlertItem) => {
    setSelectedAlert(alert);
    setModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAlert) {
      setAlerts(alerts.filter((a) => a.id !== selectedAlert.id));
      showSuccessToast(`Alert for ${selectedAlert.symbol} removed`);
    }
    setModalVisible(false);
    setSelectedAlert(null);
  };

  const getStatusBadge = (status: "on" | "off" | "read") => {
    switch (status) {
      case "on":
        return (
          <View style={styles.badgeOn}>
            <BaseText variant="bold" size="xs" color="#5ED5A8">
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
            <BaseText variant="bold" size="xs" color="#8594A6">
              Read
            </BaseText>
          </View>
        );
    }
  };

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Price alerts" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Create, edit, pause, or delete market alerts.
      </BaseText>

      <BaseButton
        title="Create alert"
        onPress={handleCreateAlert}
        style={styles.createButton}
      />

      <ScrollView contentContainerStyle={styles.scrollList}>
        {alerts.map((alert) => (
          <ProfileOptionCard
            key={alert.id}
            title={`${alert.symbol} ${alert.condition} ${alert.price}`}
            description={alert.description}
            icon={
              <Ionicons
                name="trending-up-outline"
                size={20}
                color={alert.status === "off" ? "#8594A6" : "#5ED5A8"}
              />
            }
            iconBgColor={alert.status === "off" ? "#1A2130" : "#23362F"}
            rightElement={getStatusBadge(alert.status)}
            onPress={() => handleAlertPress(alert)}
          />
        ))}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={modalVisible}
        title="Delete alert?"
        message={
          selectedAlert
            ? `This removes the ${selectedAlert.symbol} ${selectedAlert.condition} ${selectedAlert.price} alert from your list.`
            : "Are you sure you want to delete this alert?"
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
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
  createButton: {
    width: "100%",
    marginBottom: 24,
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
});
