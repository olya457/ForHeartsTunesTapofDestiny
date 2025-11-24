import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Share,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

const CARD_BROWN = '#0b0b0b7c';
const CARD_BORDER = '#F6C55B';

const ResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { winner, player1, player2, targetPoints } = route.params;

  const winnerPlayer = winner === 1 ? player1 : player2;
  const loserPlayer = winner === 1 ? player2 : player1;

  const handleViewTrophies = () => {
    navigation.navigate('Trophies');
  };

  const handleShare = async () => {
    try {
      const message =
        `RESULTS\n\nWinner: ${winnerPlayer.name} (${winnerPlayer.score}/${targetPoints})\n` +
        `Opponent: ${loserPlayer.name} (${loserPlayer.score}/${targetPoints})\n\nFor Hearts Tunes: Tap of Destiny`;
      await Share.share({ message });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <ImageBackground
      source={require('../assets/game_background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>RESULTS</Text>

        <View style={styles.card}>
          <Text style={styles.playerLine}>
            Player 1 {player1.name} — {player1.score}/{targetPoints}
          </Text>
          <Text style={styles.playerLine}>
            Player 2 {player2.name} — {player2.score}/{targetPoints}
          </Text>

          <Text style={styles.winnerText}>
            {winnerPlayer.name} WAS FASTER! HE GETS A TROPHY FOR THAT!
          </Text>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.button} onPress={handleViewTrophies}>
            <Text style={styles.buttonText}>VIEW</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>SHARE</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Image
            source={require('../assets/home_icon.png')}
            style={styles.homeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ResultsScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 120,
    paddingBottom: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 34,
  },
  card: {
    width: '100%',
    backgroundColor: CARD_BROWN,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingHorizontal: 40,
    paddingVertical: 38,
    alignItems: 'center',
  },
  playerLine: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 8,
  },
  winnerText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 20,
    columnGap: 16,
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: CARD_BROWN,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  homeButton: {
    marginTop: 26,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CARD_BROWN,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
  },
});
