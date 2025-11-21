export type RootStackParamList = {
  Loader: undefined;
  Onboarding: undefined;
  Home: undefined;

  StartDuel: undefined;

  ChoosePoints: {
    player1Name: string;
    player2Name: string;
    selectedCharacter: 'angel' | 'demon';
  };

  DuelGame: {
    player1Name: string;
    player2Name: string;
    selectedCharacter: 'angel' | 'demon';
    targetPoints: number;
  };

  Results: {
    winner: 1 | 2;
    player1: { name: string; side: 'angel' | 'demon'; score: number };
    player2: { name: string; side: 'angel' | 'demon'; score: number };
    targetPoints: number;
  };

  Trophies: undefined;
  Settings: undefined;
  About: undefined;
};
