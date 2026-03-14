import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { StyleSheet as UnistylesStyleSheet, useUnistyles } from 'react-native-unistyles';
import { Button } from '../../src/components/Button';
import { CardView } from '../../src/components/CardView';
import { getRandomKana, KanaItem, KanaType } from '../../src/utils/kana';
import { Check, X, RotateCw, Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';

type QuizMode = 'hiragana' | 'katakana' | 'mixed';

export default function KanaQuizScreen() {
  const { theme } = useUnistyles();
  
  const [mode, setMode] = useState<QuizMode>('mixed');
  const [sessionCards, setSessionCards] = useState<KanaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    startQuiz();
  }, [mode]);

  const startQuiz = () => {
    const cards = getRandomKana(10, mode);
    setSessionCards(cards);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setShowScoreModal(false);
    setUserAnswer('');
    setIsAnswered(false);
    setFlipped(false);
  };

  const handleReveal = () => {
    setFlipped(true);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(s => s + 1);
    }
    setIsAnswered(true);
    setIsCorrect(correct);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= sessionCards.length) {
      setIsFinished(true);
      setShowScoreModal(true);
    } else {
      setCurrentIndex(i => i + 1);
      setFlipped(false);
      setUserAnswer('');
      setIsAnswered(false);
    }
  };

  const speakKana = (symbol: string) => {
    Speech.speak(symbol, {
      language: 'ja',
    });
  };

  if (sessionCards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.selectText}>Select a mode to start</Text>
        <View style={styles.modeButtons}>
          <Button title="Hiragana" onPress={() => setMode('hiragana')} style={styles.modeButton} />
          <Button title="Katakana" onPress={() => setMode('katakana')} style={styles.modeButton} />
          <Button title="Mixed" onPress={() => setMode('mixed')} variant="secondary" style={styles.modeButton} />
        </View>
      </View>
    );
  }

  const currentCard = sessionCards[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {currentIndex + 1} / {sessionCards.length}
      </Text>

      <View style={styles.modeSelector}>
        <Button 
          title="Hiragana" 
          variant={mode === 'hiragana' ? 'primary' : 'secondary'} 
          onPress={() => setMode('hiragana')} 
        />
        <Button 
          title="Katakana" 
          variant={mode === 'katakana' ? 'primary' : 'secondary'} 
          onPress={() => setMode('katakana')} 
        />
        <Button 
          title="Mixed" 
          variant={mode === 'mixed' ? 'primary' : 'secondary'} 
          onPress={() => setMode('mixed')} 
        />
      </View>

      <View style={styles.cardContainer}>
        <CardView style={styles.quizCard}>
          <Pressable onPress={() => speakKana(currentCard.symbol)} style={styles.speakerButton}>
            <Volume2 size={24} color={theme.colors.muted} />
          </Pressable>
          
          <Text style={styles.symbol}>{currentCard.symbol}</Text>
          
          {!flipped && (
            <Text style={styles.tapText}>Tap to reveal answer</Text>
          )}
          
          {flipped && (
            <>
              <Text style={styles.answer}>{currentCard.romaji}</Text>
              <Text style={styles.typeLabel}>
                {currentCard.type === 'hiragana' ? 'Hiragana' : 'Katakana'}
              </Text>
            </>
          )}
        </CardView>
      </View>

      {!flipped ? (
        <View style={styles.actions}>
          <Button title="Show Answer" onPress={handleReveal} />
        </View>
      ) : !isAnswered ? (
        <View style={styles.actions}>
          <Button 
            title="Wrong" 
            variant="danger" 
            icon={<X size={18} color={theme.colors.text} />}
            onPress={() => handleAnswer(false)} 
          />
          <Button 
            title="Correct" 
            variant="primary" 
            icon={<Check size={18} color={theme.colors.primaryText} />}
            onPress={() => handleAnswer(true)} 
          />
        </View>
      ) : (
        <View style={styles.actions}>
          <Button 
            title="Next" 
            icon={<RotateCw size={18} color={theme.colors.primaryText} />}
            onPress={handleNext} 
          />
        </View>
      )}

      <Modal
        visible={showScoreModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowScoreModal(false)}
      >
        <View style={styles.modalOverlay}>
          <CardView style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Quiz Complete!</Text>
            <Text style={styles.scoreText}>
              You got {score} out of {sessionCards.length} correct!
            </Text>
            <Text style={styles.percentage}>
              {Math.round((score / sessionCards.length) * 100)}%
            </Text>
            <View style={styles.scoreActions}>
              <Button 
                title="Try Again" 
                onPress={startQuiz} 
                style={styles.scoreButton}
              />
            </View>
          </CardView>
        </View>
      </Modal>
    </View>
  );
}

const styles = UnistylesStyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  selectText: {
    fontFamily: theme.typography.bold,
    fontSize: 18,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  modeButtons: {
    gap: 12,
    paddingHorizontal: 32,
  },
  modeButton: {
    marginBottom: 0,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  progress: {
    fontFamily: theme.typography.bold,
    fontSize: 18,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  quizCard: {
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  symbol: {
    fontFamily: theme.typography.boldJapanese,
    fontSize: 72,
    color: theme.colors.text,
  },
  answer: {
    fontFamily: theme.typography.bold,
    fontSize: 32,
    color: theme.colors.text,
    marginTop: 16,
  },
  typeLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.muted,
    marginTop: 8,
  },
  tapText: {
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.muted,
    fontSize: 14,
    position: 'absolute',
    bottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  scoreCard: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    padding: 32,
  },
  scoreTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 8,
  },
  scoreText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  percentage: {
    fontFamily: theme.typography.boldJapanese,
    fontSize: 48,
    color: theme.colors.primary,
    marginVertical: 16,
  },
  scoreActions: {
    width: '100%',
    marginTop: 8,
  },
  scoreButton: {
    width: '100%',
  },
}));
