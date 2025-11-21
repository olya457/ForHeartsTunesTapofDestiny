import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import LoaderScreen from '../screens/LoaderScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import StartDuelScreen from '../screens/StartDuelScreen';
import ChoosePointsScreen from '../screens/ChoosePointsScreen';
import DuelGameScreen from '../screens/DuelGameScreen';
import ResultsScreen from '../screens/ResultsScreen';
import TrophiesScreen from '../screens/TrophiesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Loader"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Loader" component={LoaderScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="StartDuel" component={StartDuelScreen} />
      <Stack.Screen name="ChoosePoints" component={ChoosePointsScreen} />
      <Stack.Screen name="DuelGame" component={DuelGameScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />

      <Stack.Screen name="Trophies" component={TrophiesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
