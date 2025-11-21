import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Trophies'>;

type Trophy = {
  id: string;
  key: string;
  title: string;
  description: string;
  image: any;
};

const TROPHY_STORAGE_KEY = 'UNLOCKED_TROPHIES';

const ALL_TROPHIES: Trophy[] = [
  {
    id: 'venom',
    key: 'HEART OF VENOM',
    title: 'HEART OF VENOM',
    description:
      'A talisman of cunning and intuition. Its strength is in observation. It reminds you that not every movement has to be visible, but every one matters.',
    image: require('../assets/trophy_heart_of_venom.png'),
  },
  {
    id: 'ape',
    key: 'APE OF VALOR',
    title: 'APE OF VALOR',
    description:
      'A personification of strength and courage. This talisman belongs to those who are not afraid of pressure and always go to the end. Its energy awakens a true warrior spirit.',
    image: require('../assets/trophy_ape_of_valor.png'),
  },
  {
    id: 'grace',
    key: 'HEART OF GRACE',
    title: 'HEART OF GRACE',
    description:
      'A symbol of purity and balance. This talisman appears when decisions are made with goodness in your heart. It is said that it shines brighter when you act honestly.',
    image: require('../assets/trophy_heart_of_grace.png'),
  },
  {
    id: 'fury',
    key: 'HEART OF FURY',
    title: 'HEART OF FURY',
    description:
      'A symbol of passion and steadfastness. It awakens the power of action when doubts hold you back. This talisman belongs to those who go forward – even through the flames.',
    image: require('../assets/trophy_heart_of_fury.png'),
  },
  {
    id: 'rooster',
    key: 'ROOSTER OF GLORY',
    title: 'ROOSTER OF GLORY',
    description:
      'A talisman of awakening and pride. It appears when you are not afraid to be the voice of truth. Its cry heralds a new day and a new chance to win.',
    image: require('../assets/trophy_rooster_of_glory.png'),
  },
];

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedScroll = Animated.createAnimatedComponent(ScrollView);

const TrophiesScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [selectedTrophy, setSelectedTrophy] = useState<Trophy | null>(null);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const backgroundSource =
    theme === 'blue'
      ? require('../assets/background.png')
      : require('../assets/background_red.png');

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(TROPHY_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setUnlockedIds(parsed);
          }
        }
      } catch (e) {
        console.log('Load trophies error', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(20);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [selectedTrophy, unlockedIds]);

  const unlockedTrophies = ALL_TROPHIES.filter(t => unlockedIds.includes(t.id));

  const handleBack = () => {
    if (selectedTrophy) {
      setSelectedTrophy(null);
    } else {
      navigation.goBack();
    }
  };

  const handleShare = async (trophy: Trophy) => {
    try {
      await Share.share({
        message: `${trophy.title}\n\n${trophy.description}`,
      });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const handleStartDuel = () => {
    navigation.navigate('StartDuel');
  };

  const renderEmptyState = () => (
    <AnimatedView
      style={[
        styles.content,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.title}>YOUR TROPHIES</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Here you will see trophies you have won. To get one, you need to participate in a duel.
        </Text>
      </View>

      <TouchableOpacity style={styles.mainButton} onPress={handleStartDuel}>
        <Text style={styles.mainButtonText}>START DUEL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image
          source={require('../assets/back_icon.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </AnimatedView>
  );

  const renderList = () => (
    <AnimatedScroll
      style={{ flex: 1, opacity, transform: [{ translateY }] }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>YOUR TROPHIES</Text>

      {unlockedTrophies.map(trophy => (
        <View key={trophy.id} style={styles.rowCard}>
          <Image source={trophy.image} style={styles.rowImage} resizeMode="contain" />
          <TouchableOpacity
            style={styles.readButton}
            onPress={() => setSelectedTrophy(trophy)}
            activeOpacity={0.9}
          >
            <Text style={styles.readButtonText}>READ ABOUT</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image
          source={require('../assets/back_icon.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </AnimatedScroll>
  );

  const renderDetail = () => {
    if (!selectedTrophy) return null;
    return (
      <AnimatedView
        style={[
          styles.content,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.title}>YOUR TROPHIES</Text>

        <View style={styles.detailCard}>
          <Image
            source={selectedTrophy.image}
            style={styles.detailImage}
            resizeMode="contain"
          />
          <Text style={styles.detailTitle}>{selectedTrophy.title}</Text>
          <Text style={styles.detailText}>{selectedTrophy.description}</Text>
        </View>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => handleShare(selectedTrophy)}
          activeOpacity={0.9}
        >
          <Text style={styles.mainButtonText}>SHARE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('../assets/back_icon.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </AnimatedView>
    );
  };

  return (
    <ImageBackground source={backgroundSource} style={styles.background} resizeMode="cover">
      {unlockedTrophies.length === 0 && renderEmptyState()}
      {unlockedTrophies.length > 0 && !selectedTrophy && renderList()}
      {selectedTrophy && renderDetail()}
    </ImageBackground>
  );
};

export default TrophiesScreen;

const CARD_BROWN = '#4F0E00';
const CARD_BORDER = '#F6C55B';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
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
  infoCard: {
    width: '100%',
    backgroundColor: CARD_BROWN,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 24,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  mainButton: {
    marginTop: 8,
    backgroundColor: CARD_BROWN,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  rowCard: {
    width: '100%',
    backgroundColor: CARD_BROWN,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowImage: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  readButton: {
    flexShrink: 0,
    backgroundColor: '#6C1A00',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: CARD_BORDER,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  readButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  detailCard: {
    width: '100%',
    backgroundColor: CARD_BROWN,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingHorizontal: 20,
    paddingVertical: 22,
    alignItems: 'center',
  },
  detailImage: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
