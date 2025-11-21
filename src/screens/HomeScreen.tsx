import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();

  const backgroundSource =
    theme === 'blue'
      ? require('../assets/background.png')
      : require('../assets/background_red.png');

  const goTo = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen as any);
  };

  return (
    <ImageBackground source={backgroundSource} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonsWrapper}>
          <TouchableOpacity style={styles.button} onPress={() => goTo('StartDuel')}>
            <Text style={styles.buttonText}>START DUEL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => goTo('Trophies')}>
            <Text style={styles.buttonText}>TROPHIES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => goTo('Settings')}>
            <Text style={styles.buttonText}>SETTINGS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => goTo('About')}>
            <Text style={styles.buttonText}>ABOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;

const CARD_BROWN = '#4F0E00';
const CARD_BORDER = '#F6C55B';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logoWrapper: {
    marginTop: 16,
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
  buttonsWrapper: {
    width: '100%',
    gap: 18,
  },
  button: {
    backgroundColor: CARD_BROWN,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
});
