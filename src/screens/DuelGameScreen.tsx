import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'DuelGame'>;

type HeartColor = 'red' | 'blue';

const AnimatedView = Animated.createAnimatedComponent(View);

const TROPHY_STORAGE_KEY = 'UNLOCKED_TROPHIES';
const TROPHY_IDS = ['venom', 'ape', 'grace', 'fury', 'rooster'];

const DuelGameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { player1Name, player2Name, selectedCharacter, targetPoints } = route.params;

  const [leftHeartColor, setLeftHeartColor] = useState<HeartColor>('red');
  const [rightHeartColor, setRightHeartColor] = useState<HeartColor>('blue');

  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const [p1Penalty, setP1Penalty] = useState(false);
  const [p2Penalty, setP2Penalty] = useState(false);

  const [p1Delta, setP1Delta] = useState<0 | 1 | -1>(0);
  const [p2Delta, setP2Delta] = useState<0 | 1 | -1>(0);

  const [gameEnded, setGameEnded] = useState(false);

  const containerOpacity = useRef(new Animated.Value(0)).current;
  const heartsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isPlayer1Angel = selectedCharacter === 'angel';
  const player1CorrectColor: HeartColor = isPlayer1Angel ? 'blue' : 'red';
  const player2CorrectColor: HeartColor = isPlayer1Angel ? 'red' : 'blue';

  useEffect(() => {
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [containerOpacity]);

  useEffect(() => {
    if (gameEnded) {
      if (heartsTimerRef.current) {
        clearInterval(heartsTimerRef.current);
        heartsTimerRef.current = null;
      }
      return;
    }

    heartsTimerRef.current = setInterval(() => {
      setLeftHeartColor(prev => (prev === 'red' ? 'blue' : 'red'));
      setRightHeartColor(prev => (prev === 'red' ? 'blue' : 'red'));
      setP1Delta(0);
      setP2Delta(0);
    }, 700);

    return () => {
      if (heartsTimerRef.current) {
        clearInterval(heartsTimerRef.current);
        heartsTimerRef.current = null;
      }
    };
  }, [gameEnded]);

  const unlockRandomTrophy = async () => {
    try {
      const randomId =
        TROPHY_IDS[Math.floor(Math.random() * TROPHY_IDS.length)];

      const raw = await AsyncStorage.getItem(TROPHY_STORAGE_KEY);
      let ids: string[] = [];

      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          ids = parsed;
        }
      }

      if (!ids.includes(randomId)) {
        ids.push(randomId);
        await AsyncStorage.setItem(
          TROPHY_STORAGE_KEY,
          JSON.stringify(ids),
        );
      }
    } catch (e) {
      console.log('Save trophy error', e);
    }
  };

  const finishGame = async (winner: 1 | 2, finalP1: number, finalP2: number) => {
    setGameEnded(true);
    if (heartsTimerRef.current) {
      clearInterval(heartsTimerRef.current);
      heartsTimerRef.current = null;
    }

    await unlockRandomTrophy();

    navigation.navigate('Results', {
      winner,
      player1: {
        name: player1Name,
        side: isPlayer1Angel ? 'angel' : 'demon',
        score: finalP1,
      },
      player2: {
        name: player2Name,
        side: isPlayer1Angel ? 'demon' : 'angel',
        score: finalP2,
      },
      targetPoints,
    } as any);
  };

  const handleHeartPress = (player: 1 | 2) => {
    if (gameEnded) return;

    const currentColor = player === 1 ? leftHeartColor : rightHeartColor;
    const correctColor = player === 1 ? player1CorrectColor : player2CorrectColor;

    if (player === 1) {
      if (currentColor === correctColor) {
        const next = Math.min(targetPoints, p1Score + 1);
        setP1Score(next);
        setP1Delta(1);
        setP1Penalty(false);
        if (next >= targetPoints) {
          finishGame(1, next, p2Score);
        }
      } else {
        const next = Math.max(0, p1Score - 1);
        setP1Score(next);
        setP1Delta(-1);
        setP1Penalty(true);
        setTimeout(() => setP1Penalty(false), 900);
      }
    } else {
      if (currentColor === correctColor) {
        const next = Math.min(targetPoints, p2Score + 1);
        setP2Score(next);
        setP2Delta(1);
        setP2Penalty(false);
        if (next >= targetPoints) {
          finishGame(2, p1Score, next);
        }
      } else {
        const next = Math.max(0, p2Score - 1);
        setP2Score(next);
        setP2Delta(-1);
        setP2Penalty(true);
        setTimeout(() => setP2Penalty(false), 900);
      }
    }
  };

  const leftHeartSource =
    leftHeartColor === 'red'
      ? require('../assets/heart_red.png')
      : require('../assets/heart_blue.png');

  const rightHeartSource =
    rightHeartColor === 'red'
      ? require('../assets/heart_red.png')
      : require('../assets/heart_blue.png');

  const p1BarColor = p1Penalty ? '#FF4444' : '#2E9BFF';
  const p2BarColor = p2Penalty ? '#FF4444' : '#FFD43B';

  return (
    <ImageBackground
      source={require('../assets/game_background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <AnimatedView style={[styles.container, { opacity: containerOpacity }]}>
        <View style={styles.topRow}>
          <View style={styles.playerColumn}>
            <Text style={styles.playerName}>{player1Name}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(p1Score / targetPoints) * 100}%`,
                    backgroundColor: p1BarColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.scoreText}>
              {p1Score}/{targetPoints}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/back_icon.png')}
              style={styles.homeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.playerColumn}>
            <Text style={styles.playerName}>{player2Name}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(p2Score / targetPoints) * 100}%`,
                    backgroundColor: p2BarColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.scoreText}>
              {p2Score}/{targetPoints}
            </Text>
          </View>
        </View>

        <View style={styles.heartsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.heartWrapper}
            onPress={() => handleHeartPress(1)}
          >
            <Image source={leftHeartSource} style={styles.heartImage} resizeMode="contain" />
            {p1Delta !== 0 && (
              <Text
                style={[
                  styles.deltaText,
                  p1Delta === -1 ? styles.deltaNegative : styles.deltaPositive,
                ]}
              >
                {p1Delta === -1 ? '-1' : '+1'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.heartWrapper}
            onPress={() => handleHeartPress(2)}
          >
            <Image source={rightHeartSource} style={styles.heartImage} resizeMode="contain" />
            {p2Delta !== 0 && (
              <Text
                style={[
                  styles.deltaText,
                  p2Delta === -1 ? styles.deltaNegative : styles.deltaPositive,
                ]}
              >
                {p2Delta === -1 ? '-1' : '+1'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.charactersRow}>
          <Image
            source={
              isPlayer1Angel
                ? require('../assets/character_angel.png')
                : require('../assets/character_demon.png')
            }
            style={styles.characterImage}
            resizeMode="contain"
          />
          <Image
            source={
              isPlayer1Angel
                ? require('../assets/character_demon.png')
                : require('../assets/character_angel.png')
            }
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>
      </AnimatedView>
    </ImageBackground>
  );
};

export default DuelGameScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressBar: {
    width: '85%',
    height: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
  },
  homeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F0E00',
    borderWidth: 3,
    borderColor: '#F6C55B',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  homeIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
  },
  heartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 12,
  },
  heartWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  heartImage: {
    width: 150,
    height: 150,
  },
  deltaText: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
  },
  deltaNegative: {
    color: '#FF4A4A',
  },
  deltaPositive: {
    color: '#00FF7A',
  },
  charactersRow: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  characterImage: {
    width: 120,
    height: 150,
  },
});
