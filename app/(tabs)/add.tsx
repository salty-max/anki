import React, { useState, useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useCardStore } from '../../src/store';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { CardView } from '../../src/components/CardView';

export default function AddScreen() {
  const [japanese, setJapanese] = useState('');
  const [reading, setReading] = useState('');
  const [meaning, setMeaning] = useState('');
  
  const addCard = useCardStore(state => state.addCard);
  const router = useRouter();

  const handleAdd = useCallback(async () => {
    if (!japanese.trim() || !meaning.trim()) {
      Alert.alert('Error', 'Japanese and Meaning are required.');
      return;
    }

    await addCard({
      japanese: japanese.trim(),
      reading: reading.trim(),
      meaning: meaning.trim(),
    });

    setJapanese('');
    setReading('');
    setMeaning('');
    
    router.push('/');
  }, [japanese, reading, meaning, addCard, router]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <CardView>
          <Input
            label="Japanese (Kanji/Kana)"
            value={japanese}
            onChangeText={setJapanese}
            placeholder="e.g. 猫 or ねこ"
          />
          <Input
            label="Reading (Furigana/Romaji)"
            value={reading}
            onChangeText={setReading}
            placeholder="e.g. neko"
          />
          <Input
            label="Meaning (English)"
            value={meaning}
            onChangeText={setMeaning}
            placeholder="e.g. cat"
          />
          <View style={styles.buttonContainer}>
            <Button title="Add Flashcard" onPress={handleAdd} />
          </View>
        </CardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
}));