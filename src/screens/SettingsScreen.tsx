import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const AnimatedView = Animated.createAnimatedComponent(View);

const CARD_BROWN = '#0b0b0b7c';
const CARD_BORDER = '#F6C55B';
const GREEN_GLOW = '#00FF6A';

const TROPHY_STORAGE_KEY = 'UNLOCKED_TROPHIES';

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, setTheme } = useAppTheme();
  const [notificationsOn, setNotificationsOn] = useState(true);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const toggleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const backgroundSource =
    theme === 'blue'
      ? require('../assets/background.png')
      : require('../assets/background_red.png');

  const switchBackground = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#444444', '#2C8C28'],
  });

  const thumbTranslate = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28],
  });

  const toggleNotifications = () => {
    setNotificationsOn(prev => {
      const next = !prev;
      Animated.timing(toggleAnim, {
        toValue: next ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
      return next;
    });
  };

  const selectTheme = (value: 'blue' | 'red') => {
    setTheme(value);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset progress',
      'Are you sure you want to reset your progress? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'RESET',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(TROPHY_STORAGE_KEY);
              console.log('Progress reset');
            } catch (e) {
              console.log('Reset error', e);
            }
          },
        },
      ],
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={backgroundSource} style={styles.background} resizeMode="cover">
      <AnimatedView
        style={[
          styles.container,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.title}>SETTINGS</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>NOTIFICATIONS</Text>
          <TouchableOpacity onPress={toggleNotifications} activeOpacity={0.9}>
            <Animated.View
              style={[
                styles.switchContainer,
                {
                  backgroundColor: switchBackground,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.switchThumb,
                  {
                    transform: [{ translateX: thumbTranslate }],
                  },
                ]}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.cardLarge]}>
          <Text style={styles.cardTitle}>CHANGE BACKGROUND</Text>

          <View style={styles.bgRow}>
            <TouchableOpacity
              style={[
                styles.bgOptionWrapper,
                theme === 'blue' && styles.bgOptionWrapperSelected,
              ]}
              onPress={() => selectTheme('blue')}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require('../assets/background.png')}
                style={styles.bgPreview}
                imageStyle={styles.bgPreviewImage}
              >
                {theme === 'blue' && <Text style={styles.checkmark}>✓</Text>}
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bgOptionWrapper,
                theme === 'red' && styles.bgOptionWrapperSelected,
              ]}
              onPress={() => selectTheme('red')}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={require('../assets/background_red.png')}
                style={styles.bgPreview}
                imageStyle={styles.bgPreviewImage}
              >
                {theme === 'red' && <Text style={styles.checkmark}>✓</Text>}
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>RESET PROGRESS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('../assets/back_icon.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </AnimatedView>
    </ImageBackground>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: CARD_BROWN,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLarge: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  switchContainer: {
    width: 60,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: CARD_BORDER,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  bgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  bgOptionWrapper: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 3,
  },
  bgOptionWrapperSelected: {
    borderColor: GREEN_GLOW,
    shadowColor: GREEN_GLOW,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  bgPreview: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 6,
  },
  bgPreviewImage: {
    borderRadius: 10,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  resetButton: {
    marginTop: 24,
    backgroundColor: CARD_BROWN,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  backButton: {
    marginTop: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CARD_BROWN,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
  },
});
