import { Tabs } from 'expo-router';
import React from 'react';
import { Library, PlusCircle, BrainCircuit } from 'lucide-react-native';
import { useUnistyles } from 'react-native-unistyles';

export default function TabLayout() {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTitleStyle: {
          color: theme.colors.text,
          fontFamily: theme.typography.bold,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Deck',
          tabBarIcon: ({ color }) => <Library color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Word',
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <BrainCircuit color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}