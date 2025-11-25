import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'StartDuel'>;

const AnimatedView = Animated.createAnimatedComponent(View);

const StartDuelScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedCharacter, setSelectedCharacter] = useState<'angel' | 'demon' | null>(null);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const runAppear = () => {
    opacity.setValue(0);
    translateY.setValue(20);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    runAppear();
  }, [step]);

  const backgroundSource =
    theme === 'blue'
      ? require('../assets/background.png')
      : require('../assets/background_red.png');

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep(prev => ((prev - 1) as 0 | 1 | 2));
    }
  };

  const handleNextRules = () => {
    setStep(1);
  };

  const handleChooseCharacter = () => {
    if (selectedCharacter) {
      setStep(2);
    }
  };

  const handleSavePlayers = () => {
    if (!selectedCharacter) return;
    if (!player1Name.trim() || !player2Name.trim()) return;

    navigation.navigate('ChoosePoints', {
      player1Name: player1Name.trim(),
      player2Name: player2Name.trim(),
      selectedCharacter,
    });
  };

  const renderRules = () => (
    <AnimatedView
      style={[
        styles.contentWrapperRules,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Image source={require('../assets/logo.png')} style={styles.logoTop} resizeMode="contain" />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>GAME RULES</Text>
        <Text style={styles.cardText}>
          In the game “Plink Balls Glory”, each player has their own heart and a
          progress bar. The heart constantly changes color – your task is to tap only when it shines
          in your color: for an Angel – yellow, for a Demon – blue. Each accurate touch adds points to
          the progress bar, and a mistake subtracts one. Before the game, you choose how many points
          you need to score. Whoever fills their bar first gains the power of the Heart of Destiny.
        </Text>
      </View>

      <TouchableOpacity style={styles.mainButton} onPress={handleNextRules}>
        <Text style={styles.mainButtonText}>NEXT</Text>
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

  const renderChooseCharacter = () => (
    <AnimatedView
      style={[
        styles.contentWrapper,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.screenTitle}>CHOOSE A CHARACTER</Text>
      <Text style={styles.playerLabel}>Player 1</Text>

      <View style={styles.charactersRow}>
        <TouchableOpacity
          style={[
            styles.characterCard,
            selectedCharacter === 'demon' && styles.characterCardSelected,
          ]}
          activeOpacity={0.9}
          onPress={() => setSelectedCharacter('demon')}
        >
          <Image
            source={require('../assets/character_demon.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.characterCard,
            selectedCharacter === 'angel' && styles.characterCardSelected,
          ]}
          activeOpacity={0.9}
          onPress={() => setSelectedCharacter('angel')}
        >
          <Image
            source={require('../assets/character_angel.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {selectedCharacter && (
        <TouchableOpacity style={styles.mainButton} onPress={handleChooseCharacter}>
          <Text style={styles.mainButtonText}>CHOOSE</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image
          source={require('../assets/back_icon.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </AnimatedView>
  );

  const renderNames = () => (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <AnimatedView
        style={[
          styles.contentWrapper,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.namesScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.screenTitle}>CHOOSE A CHARACTER</Text>

          <View style={styles.selectedCharWrapper}>
            <Image
              source={
                activePlayer === 1
                  ? selectedCharacter === 'angel'
                    ? require('../assets/character_angel.png')
                    : require('../assets/character_demon.png')
                  : selectedCharacter === 'angel'
                  ? require('../assets/character_demon.png')
                  : require('../assets/character_angel.png')
              }
              style={styles.selectedCharacterImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.nameBlock}>
            <Text style={styles.nameLabel}>Player 1</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Write your name..."
                placeholderTextColor="#F2D7B9"
                value={player1Name}
                onChangeText={setPlayer1Name}
                onFocus={() => setActivePlayer(1)}
              />
            </View>
          </View>

          <View style={styles.nameBlock}>
            <Text style={styles.nameLabel}>Player 2</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Write your name..."
                placeholderTextColor="#F2D7B9"
                value={player2Name}
                onChangeText={setPlayer2Name}
                onFocus={() => setActivePlayer(2)}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.mainButton} onPress={handleSavePlayers}>
            <Text style={styles.mainButtonText}>SAVE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButtonNames} onPress={handleBack}>
            <Image
              source={require('../assets/back_icon.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ScrollView>
      </AnimatedView>
    </KeyboardAvoidingView>
  );

  return (
    <ImageBackground source={backgroundSource} style={styles.background} resizeMode="cover">
      {step === 0 && renderRules()}
      {step === 1 && renderChooseCharacter()}
      {step === 2 && renderNames()}
    </ImageBackground>
  );
};

export default StartDuelScreen;

const CARD_BROWN = '#0b0b0b7c';
const CARD_BORDER = '#F6C55B';
const GREEN_GLOW = '#00FF6A';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  contentWrapperRules: {
    flex: 1,
    paddingTop: 70,
    paddingBottom: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoTop: {
    width: 150,
    height: 150,
    marginBottom: 32,
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
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  mainButton: {
    marginTop: 24,
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
    marginTop: 32,
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
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  playerLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 24,
  },
  charactersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  characterCard: {
    flex: 1,
    marginHorizontal: 8,
    aspectRatio: 1,
    borderRadius: 22,
    backgroundColor: CARD_BROWN,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterCardSelected: {
    borderColor: GREEN_GLOW,
    shadowColor: GREEN_GLOW,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  characterImage: {
    width: '80%',
    height: '80%',
  },
  namesScrollContent: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  selectedCharWrapper: {
    width: 180,
    height: 180,
    borderRadius: 30,
    backgroundColor: CARD_BROWN,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  selectedCharacterImage: {
    width: '80%',
    height: '80%',
  },
  nameBlock: {
    width: '100%',
    marginBottom: 18,
  },
  nameLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  inputWrapper: {
    backgroundColor: CARD_BROWN,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  backButtonNames: {
    marginTop: 24,
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
});
