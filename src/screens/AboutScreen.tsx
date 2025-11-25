import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Share,
  ScrollView,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

const SHARE_TEXT =
  'For Hearts Tunes: Tap of Destiny is an offline reaction game for two. Choose a side — the Angel of Light or the Demon of Flame — and tap only when your heart shines in your color. Every accurate touch adds energy, a mistake takes it away.';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const AboutScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

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

  const handleShare = async () => {
    try {
      await Share.share({
        message: SHARE_TEXT,
      });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const backgroundSource =
    theme === 'blue'
      ? require('../assets/background.png')
      : require('../assets/background_red.png');

  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.background}
      resizeMode="cover"
    >
      <AnimatedScrollView
        style={[styles.scrollView, { opacity, transform: [{ translateY }] }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>ABOUT THE APP</Text>

        <View style={styles.card}>
          <Text style={styles.cardText}>
            Plink Balls Glory is an offline reaction game for two.
            Choose a side — the Angel of Light or the Demon of Flame — and tap
            only when your heart shines in your color. Every accurate touch adds
            energy, and a mistake takes it away. Before the game, you can set
            the number of points for victory, change the interface background to
            yellow or blue, and compete to see whose heart will be stronger. For
            skill, open trophies and collect your collection of the power of the
            Heart of Destiny.
          </Text>

          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>SHARE</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('../assets/back_icon.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </AnimatedScrollView>
    </ImageBackground>
  );
};

export default AboutScreen;

const CARD_BROWN = '#0b0b0b7c';
const CARD_BORDER = '#F6C55B';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
    paddingTop: 18,
    paddingBottom: 24,
    alignItems: 'center',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  logo: {
    marginTop: 24,
    width: 140,
    height: 140,
  },
  shareButton: {
    marginTop: 18,
    backgroundColor: CARD_BROWN,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomSpace: {
    height: 40,
  },
  backButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0b0b0b7c',
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
