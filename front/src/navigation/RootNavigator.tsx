/**
 * Root Navigator
 * 앱의 메인 네비게이션 구조
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { BlockDetailScreen } from '../screens/BlockDetailScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CreateProjectScreen } from '../screens/CreateProjectScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'My Mandalateu',
          }}
        />
        <Stack.Screen
          name="BlockDetail"
          component={BlockDetailScreen}
          options={{
            title: '블록 상세',
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: '통계',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: '설정',
          }}
        />
        <Stack.Screen
          name="CreateProject"
          component={CreateProjectScreen}
          options={{
            title: '새 프로젝트',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
