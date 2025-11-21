import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ChoosePoints'>;

const AnimatedView = Animated.createAnimatedComponent(View);

const pointsOptions = [5, 10, 15, 25];

const ChoosePointsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useAppTheme();
  const { player1Name, player2Name, selectedCharacter } = route.params;

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(20);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const backgroundSource =
    theme === 'blue'
      ? require('../assets/background.png')
      : require('../assets/background_red.png');

  const handleBack = () => navigation.goBack();

  const handleSelectPoints = (points: number) => {
    navigation.navigate('DuelGame', {
      player1Name,
      player2Name,
      selectedCharacter,
      targetPoints: points,
    });
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
        <Text style={styles.title}>CHOOSE THE NUMBER{'\n'}OF POINTS</Text>

        <View style={styles.buttonsWrapper}>
          {pointsOptions.map(p => (
            <TouchableOpacity
              key={p}
              style={styles.pointsButton}
              onPress={() => handleSelectPoints(p)}
              activeOpacity={0.9}
            >
              <Text style={styles.pointsText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

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

export default ChoosePointsScreen;

const CARD_BROWN = '#4F0E00';
const CARD_BORDER = '#F6C55B';

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
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonsWrapper: {
    width: '100%',
    gap: 16,
  },
  pointsButton: {
    width: '100%',
    backgroundColor: CARD_BROWN,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingVertical: 12,
    alignItems: 'center',
  },
  pointsText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
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
