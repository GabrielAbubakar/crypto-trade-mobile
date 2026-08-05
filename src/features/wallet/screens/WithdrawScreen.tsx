import { ScreenContainer, SelectOptionsSheet } from "@/shared/ui";
import { Colors } from "@/shared/constants";
import { showErrorToast, showSuccessToast } from "@/shared/utils";
import { useGetProfileQuery } from "@/features/profile";
import { useGetWalletBalancesQuery, useWithdrawMutation } from "@/features/wallet/api/walletApi";
import { WithdrawConfirmStep, WithdrawFormStep, WithdrawSubmittedStep } from "@/features/wallet/components";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "expo-router";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { BackHandler, StyleSheet } from "react-native";

type WithdrawStep = "form" | "confirm" | "submitted";

export default function WithdrawScreen() {
  const router = useRouter();
  const [step, setStep] = useState<WithdrawStep>("form");

  // Form State
  const [network, setNetwork] = useState<string>("");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("USDT");
  const assetSheetRef = useRef<BottomSheetModal>(null);

  // API Integration
  const { data: balanceData } = useGetWalletBalancesQuery();
  const { data: profileData } = useGetProfileQuery();
  const [withdraw, { isLoading: isSubmitting }] = useWithdrawMutation();
  const [txId, setTxId] = useState<string>("");

  const assetOptions = useMemo(() => {
    if (!balanceData?.wallet?.balances) return [];
    return balanceData.wallet.balances.map((b) => ({
      value: b.assetSymbol.toUpperCase(),
      label: `Available: ${b.available.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      })}`,
    }));
  }, [balanceData]);

  const selectedBalance = useMemo(() => {
    const balanceObj = balanceData?.wallet?.balances.find(
      (b) => b.assetSymbol.toUpperCase() === selectedSymbol.toUpperCase(),
    );
    return (
      balanceObj?.available ??
      (selectedSymbol.toUpperCase() === "USDT" ? 1000.0 : 0.0)
    );
  }, [balanceData, selectedSymbol]);

  // TanStack Form Setup
  const form = useForm({
    defaultValues: {
      amount: "",
      address: "",
    },
    onSubmit: async () => {
      setStep("confirm");
    },
  });

  const handleSubmitWithdrawal = useCallback(async () => {
    try {
      const response = await withdraw({
        amount: Number(form.state.values.amount),
        assetSymbol: selectedSymbol,
        address: form.state.values.address,
        network: network,
      }).unwrap();

      if (response && response.id) {
        setTxId(response.id);
        showSuccessToast("Withdrawal request submitted!");
        setStep("submitted");
      } else {
        showErrorToast("Withdrawal failed.");
      }
    } catch (err: any) {
      showErrorToast(
        err?.data?.message || "An error occurred during withdrawal.",
      );
    }
  }, [withdraw, form, selectedSymbol, network]);

  const handleBack = useCallback(() => {
    if (step === "confirm") {
      setStep("form");
    } else if (step === "submitted") {
      router.replace("/(tabs)/wallets");
    } else {
      router.back();
    }
  }, [step, router]);

  // Handle hardware / system back buttons
  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true; // Prevent default action (bubbling/exiting)
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => subscription.remove();
  }, [handleBack]);

  return (
    <ScreenContainer
      avoidKeyboard={true}
      scrollable={true}
      keyboardVerticalOffset={40}
      style={styles.container}
    >
      {step === "form" && (
        <WithdrawFormStep
          balanceData={balanceData}
          profileData={profileData}
          form={form}
          selectedSymbol={selectedSymbol}
          selectedBalance={selectedBalance}
          network={network}
          setNetwork={setNetwork}
          onSelectAssetPress={() => assetSheetRef.current?.present()}
          onBack={handleBack}
        />
      )}

      {step === "confirm" && (
        <WithdrawConfirmStep
          form={form}
          selectedSymbol={selectedSymbol}
          network={network}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitWithdrawal}
          onBack={handleBack}
        />
      )}

      {step === "submitted" && (
        <WithdrawSubmittedStep
          form={form}
          selectedSymbol={selectedSymbol}
          txId={txId}
          onBack={handleBack}
        />
      )}

      <SelectOptionsSheet
        ref={assetSheetRef}
        title="Select Asset"
        options={assetOptions}
        selectedValue={selectedSymbol}
        onSelect={(value) => {
          setSelectedSymbol(value);
          form.setFieldValue("amount", "");
          assetSheetRef.current?.dismiss();
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flex: 1,
    paddingBottom: 50,
  },
});
