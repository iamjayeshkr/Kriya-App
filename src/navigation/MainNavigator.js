import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Platform, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Home, CheckSquare, Timer, BarChart2, Settings } from 'lucide-react-native';

import DashboardScreen  from '../screens/main/DashboardScreen';
import TasksScreen      from '../screens/main/TasksScreen';
import TaskDetailScreen from '../screens/main/TaskDetailScreen';
import FocusScreen      from '../screens/main/FocusScreen';
import HabitsScreen     from '../screens/main/HabitsScreen';
import AnalyticsScreen  from '../screens/main/AnalyticsScreen';
import SettingsScreen   from '../screens/main/SettingsScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * TasksStack: A nested stack navigator for Task-related screens.
 * This allows navigation between the task list and the details of a specific task
 * while staying within the "Tasks" tab.
 */
function TasksStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TasksList"   component={TasksScreen} />
      <Stack.Screen name="TaskDetail"  component={TaskDetailScreen} />
    </Stack.Navigator>
  );
}

// Configuration for the bottom tabs
const TABS = [
  { name: 'Dashboard', label: 'Home',     Icon: Home,       emoji: '🏠' },
  { name: 'Tasks',     label: 'Tasks',    Icon: CheckSquare, emoji: '✅' },
  { name: 'Focus',     label: 'Focus',    Icon: Timer,       emoji: '⏱' },
  { name: 'Analytics', label: 'Stats',    Icon: BarChart2,   emoji: '📊' },
  { name: 'Settings',  label: 'Settings', Icon: Settings,    emoji: '⚙️' },
];

/**
 * MainNavigator: The main tab-based navigation for authenticated users.
 * It defines the persistent bottom navigation bar and the main screens of the app.
 */
export default function MainNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = TABS.find((t) => t.name === route.name);
        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor:   theme.accent.primary,
          tabBarInactiveTintColor: theme.text.muted,
          tabBarStyle: {
            backgroundColor: theme.bg.card,
            borderTopColor: theme.border.default,
            borderTopWidth: 1,
            // Adjust height based on platform for safe area compliance
            height: Platform.OS === 'ios' ? 88 : 66,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
          // Custom icon rendering with a highlighted background for the active tab
          tabBarIcon: ({ focused, color, size }) => {
            const Icon = tab?.Icon || Home;
            return (
              <View style={{
                width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
                backgroundColor: focused ? theme.accent.primary + '18' : 'transparent',
              }}>
                <Icon color={color} size={20} strokeWidth={focused ? 2.5 : 1.8} />
              </View>
            );
          },
          tabBarLabel: tab?.label || route.name,
        };
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Tasks"     component={TasksStack} />
      <Tab.Screen name="Focus"     component={FocusScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Settings"  component={SettingsScreen} />
    </Tab.Navigator>
  );
}
