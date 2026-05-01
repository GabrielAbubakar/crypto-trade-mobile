import { BaseText } from "@/components";
import { Colors, tabs } from "@/constants";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: "shift",
          tabBarStyle: {
            paddingTop: 10,
            borderTopColor: "transparent",
            backgroundColor: Colors.background,
            borderRadius: 20,
            height: 80,
            marginBottom: 40,
            marginHorizontal: 20,
            position: "absolute",
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
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color, focused }) => {
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
                    <Icon
                      color={focused ? Colors.primary : color}
                      width={44}
                      height={44}
                    />
                  </View>
                );
              },
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
