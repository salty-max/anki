import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useCardStore, Card } from '../../src/store';
import { CardView } from '../../src/components/CardView';
import { Button } from '../../src/components/Button';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';

export default function QuizScreen() {
  const { cards, reviewCard } = useCardStore(
    useShallow((state) => ({
      cards: state.cards,
      reviewCard: state.reviewCard,
    }))
  );
  
  const [sessionCards, setSessionCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isActiveSession, setIsActiveSession] = useState(false);

  const flipRotation = useSharedValue(0);

  useEffect(() => {
    if (!isActiveSession) {
      const now = Date.now();
      const toReview = cards.filter(c => c.dueAt! <= now).slice(0, 10);
      setSessionCards(toReview);
      setCurrentIndex(0);
      setScore(0);
      setIsFinished(false);
      setFlipped(false);
      flipRotation.value = 0;
      
      if (toReview.length > 0) {
        setIsActiveSession(true);
      }
    }
  }, [cards, isActiveSession, flipRotation]);

  const toggleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
    flipRotation.value = withTiming(flipped ? 0 : 180, { duration: 300 });
  }, [flipped, flipRotation]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  const handleAnswer = useCallback(async (remembered: boolean) => {
    const currentCard = sessionCards[currentIndex];
    if (!currentCard) return;

    // Fire and forget (or await) the database update
    await reviewCard(currentCard.id, remembered);
    
    if (remembered) {
      setScore((s) => s + 1);
    }
    
    setFlipped(false);
    flipRotation.value = 0;
    
    if (currentIndex + 1 >= sessionCards.length) {
      setIsFinished(true);
      setIsActiveSession(false); // End session
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [sessionCards, currentIndex, reviewCard, flipRotation]);

  if (isFinished && sessionCards.length > 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.doneText}>Quiz Complete!</Text>
        <Text style={styles.subText}>You remembered {score} out of {sessionCards.length} words.</Text>
        <View style={styles.actions}>
          <Button 
            title="Start Next Session" 
            onPress={() => setIsFinished(false)} // This will trigger useEffect if there are more due cards
            style={styles.actionBtn}
          />
        </View>
      </View>
    );
  }

  if (sessionCards.length === 0 || (!isActiveSession && !isFinished)) {
    return (
      <View style={styles.center}>
        <Text style={styles.doneText}>You're all caught up!</Text>
        <Text style={styles.subText}>No cards due for review.</Text>
      </View>
    );
  }

  const currentCard = sessionCards[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {currentIndex + 1} / {sessionCards.length}
      </Text>
      
      <View style={styles.cardContainer}>
        <Pressable onPress={toggleFlip} style={styles.pressable}>
          <Animated.View style={[styles.cardWrapper, frontAnimatedStyle]}>
            <CardView style={styles.quizCard}>
              <Text style={styles.japanese}>{currentCard.japanese}</Text>
              <Text style={styles.tapText}>Tap to flip</Text>
            </CardView>
          </Animated.View>

          <Animated.View style={[styles.cardWrapper, backAnimatedStyle, { pointerEvents: flipped ? 'auto' : 'none' }]}>
            <CardView style={styles.quizCard}>
              <Text style={styles.meaning}>{currentCard.meaning}</Text>
              {currentCard.reading && <Text style={styles.reading}>{currentCard.reading}</Text>}
              <Text style={styles.tapText}>Tap to flip back</Text>
            </CardView>
          </Animated.View>
        </Pressable>
      </View>

      {flipped && (
        <View style={styles.actions}>
          <Button 
            title="Forgot" 
            variant="danger" 
            style={styles.actionBtn}
            onPress={() => handleAnswer(false)} 
          />
          <Button 
            title="Remembered" 
            variant="primary" 
            style={styles.actionBtn}
            onPress={() => handleAnswer(true)} 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneText: {
    fontFamily: theme.typography.bold,
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 8,
  },
  subText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.muted,
  },
  progress: {
    fontFamily: theme.typography.bold,
    fontSize: 18,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  pressable: {
    width: '100%',
    height: '100%',
  },
  cardWrapper: {
    width: '100%',
    height: '100%',
  },
  quizCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  japanese: {
    fontFamily: theme.typography.boldJapanese,
    fontSize: 48,
    color: theme.colors.text,
  },
  meaning: {
    fontFamily: theme.typography.bold,
    fontSize: 32,
    color: theme.colors.text,
    textAlign: 'center',
  },
  reading: {
    fontFamily: theme.typography.fontFamilyJapanese,
    fontSize: 20,
    color: theme.colors.muted,
    marginTop: 16,
  },
  tapText: {
    position: 'absolute',
    bottom: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.muted,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    gap: 16,
  },
  actionBtn: {
    flex: 1,
  },
}));