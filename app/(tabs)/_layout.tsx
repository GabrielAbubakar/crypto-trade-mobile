import { BaseText } from "@/components/ui";
import { Colors, tabs } from "@/core/constants";
import { usePushNotifications } from "@/core/hooks/usePushNotifications";
import { useAppSelector } from "@/core/store/hooks";
import { Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";

export default function TabsLayout() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Initialize push notifications
  usePushNotifications(isAuthenticated);

  const screenOptions = {
    headerShown: false,
    animation: "shift" as const,
    tabBarStyle: {
      paddingTop: 10,
      borderTopColor: "transparent",
      backgroundColor: Colors.background,
      borderRadius: 20,
      height: 80,
      marginBottom: 25,
      marginHorizontal: 20,
      position: "absolute" as const,
      right: 0,
      bottom: 0,
      elevation: 0,
      boxShadow: [
        {
          offsetX: 0,
          offsetY: 12,
          blurRadius: 50,
          color: "rgba(22, 28, 34, 0.25)",
        },
      ],
    },
    tabBarActiveTintColor: Colors.primary,
  };

  function renderTabBarIcon(
    { color, focused }: { color: string; focused: boolean },
    tab: (typeof tabs)[number],
  ) {
    const Icon = tab.icon;
    return (
      <View
        style={{
          borderRadius: 15,
          paddingVertical: 17,
          paddingHorizontal: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon color={focused ? Colors.primary : color} width={44} height={44} />
      </View>
    );
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Tabs screenOptions={screenOptions}>
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              href: (tab as any).href,
              tabBarIcon: ({ color, focused }) =>
                renderTabBarIcon({ color, focused }, tab),
              tabBarLabel: ({ color }: any) => {
                return (
                  <BaseText
                    style={{
                      color,
                      fontSize: 12,
                      // Creates a solid gap between the icon block and text
                    }}
                  >
                    {tab.title}
                  </BaseText>
                );
              },
            }}
          />
        ))}
      </Tabs>
      <StatusBar style="light" />
    </>
  );
}
