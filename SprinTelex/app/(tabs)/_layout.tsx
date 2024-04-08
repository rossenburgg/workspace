import React from 'react';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>['name'];
  color: string;
}) {
  return <AntDesign size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarIcon: ({ color }) => <TabBarIcon name="link" color={color} />,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: route.name === "ReelsScreen" ? { backgroundColor: 'black', position: 'absolute', borderTopWidth: 0, } : {},
        headerStyle: route.name === "ReelsScreen" ? { backgroundColor: 'transparent' } : {},
        headerTransparent: route.name === "ReelsScreen" ? true : false,
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/NotificationsScreen" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="bell-o"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerLeft: () => (
            <Link href="/NotificationsScreen" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="reddit"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          
        }}
      />
      <Tabs.Screen
        name="ReelsScreen"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="camera" color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="ChatScreen"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="phone"  color={color} />
          ),
          headerRight: () => (
            <Link href="/SearchScreen" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="search"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
       <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          headerTitle: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user"  color={color} />
          ),
          headerRight: () => (
            <Link href="/settingsModal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="cog"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}