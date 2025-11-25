import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

type OnboardingPage = {
  key: string;
  image: any;
  title: string;
  description: string;
  buttonLabel: string;
};

const pages: OnboardingPage[] = [
  {
    key: 'page1',
    image: require('../assets/onb_heart.png'),
    title: 'HEART OF DESTINY',
    description:
      'Two forces live in every heart.\nThe light that brings harmony,\nand the flame that gives power.',
    buttonLabel: 'NEXT',
  },
  {
    key: 'page2',
    image: require('../assets/onb_angel_demon.png'),
    title: 'CHOOSE YOUR SIDE',
    description:
      'Who are you today – Angel of Light or\nDemon of Flame?\nWrite your name and let your heart\ndecide your fate.',
    buttonLabel: 'NEXT',
  },
  {
    key: 'page3',
    image: require('../assets/onb_trophies.png'),
    title: 'HEARTBEAT',
    description:
      'Tap when the heart glows your color –\yellow or blue. Each touch adds energy\nto your side and brings you closer\nto triumph.',
    buttonLabel: 'START',
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const current = pages[pageIndex];

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageTranslateY = useRef(new Animated.Value(20)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(40)).current;

  const runAppearAnimation = () => {
    imageOpacity.setValue(0);
    imageTranslateY.setValue(20);
    cardOpacity.setValue(0);
    cardTranslateY.setValue(40);

    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(imageTranslateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  useEffect(() => {
    runAppearAnimation();
  }, [pageIndex]);

  const handleNext = () => {
    if (pageIndex < pages.length - 1) {
      setPageIndex(pageIndex + 1);
    } else {
      navigation.replace('Home');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            },
          ]}
        >
          <Image
            source={current.image}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }],
            },
          ]}
        >
          <Text style={styles.cardTitle}>{current.title}</Text>
          <Text style={styles.cardText}>{current.description}</Text>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>{current.buttonLabel}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default OnboardingScreen;

const CARD_BROWN = '#0b0b0b7c';
const CARD_BORDER = '#F6C55B';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    width: '80%',
    height: '100%',
  },
  card: {
    backgroundColor: CARD_BROWN,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    alignItems: 'center',
  },
  buttonInner: {
    backgroundColor: CARD_BORDER,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#4A1E09',
    fontSize: 16,
    fontWeight: '800',
  },
});
