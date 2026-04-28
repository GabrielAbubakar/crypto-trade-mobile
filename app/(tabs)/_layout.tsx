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
                      fontSize: 14,
                      marginTop: 10, // Creates a solid gap between the icon block and text
                    }}
                  >
                    {tab.title}
                  </BaseText>
                );
              },
              tabBarActiveTintColor: Colors.primary,
              tabBarStyle: {
                borderTopColor: "transparent",
                backgroundColor: Colors.background,
                height: 100,
                paddingBottom: 40,
                paddingTop: 15,
                paddingHorizontal: 15,
              },
            }}
          />
        ))}
      </Tabs>
      <StatusBar style="light" />
    </>
  );
}
