import React, { useState, useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useCardStore } from '../../src/store';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { CardView } from '../../src/components/CardView';

export default function AddScreen() {
  const [japanese, setJapanese] = useState('');
  const [reading, setReading] = useState('');
  const [meaning, setMeaning] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  
  const addCard = useCardStore(state => state.addCard);
  const router = useRouter();
  const { theme } = useUnistyles();

  const handleAutocomplete = useCallback(async () => {
    if (!meaning.trim()) {
      Alert.alert('Error', 'Please enter an English meaning first to search.');
      return;
    }

    setIsFetching(true);
    try {
      // Use standard fetch as axios might trigger 403 on Jisho
      const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(meaning.trim())}`);
      const json = await response.json();

      if (json.data && json.data.length > 0) {
        // Try to find a common word first
        const bestMatch = json.data.find((item: any) => item.is_common) || json.data[0];
        
        const jp = bestMatch.japanese[0];
        if (jp) {
          setJapanese(jp.word || jp.reading || '');
          setReading(jp.word ? jp.reading || '' : '');
          
          // Optionally update meaning to the best English definition found
          const defs = bestMatch.senses[0]?.english_definitions;
          if (defs && defs.length > 0) {
             setMeaning(defs.join(', '));
          }
        } else {
           Alert.alert('Not Found', 'Could not extract Japanese reading for this word.');
        }
      } else {
        Alert.alert('Not Found', 'No dictionary results found for that meaning.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch autocomplete data. Check your connection.');
    } finally {
      setIsFetching(false);
    }
  }, [meaning]);

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
            label="Meaning (English)"
            value={meaning}
            onChangeText={setMeaning}
            placeholder="e.g. dog"
            returnKeyType="search"
            onSubmitEditing={handleAutocomplete}
          />
          
          <View style={styles.autocompleteContainer}>
             <Button 
               title={isFetching ? "Searching..." : "Auto-fill from English"} 
               variant="secondary" 
               onPress={handleAutocomplete} 
               disabled={isFetching}
             />
             {isFetching && <ActivityIndicator style={styles.loader} color={theme.colors.primary} />}
          </View>

          <Input
            label="Japanese (Kanji/Kana)"
            value={japanese}
            onChangeText={setJapanese}
            placeholder="e.g. 犬 or いぬ"
          />
          <Input
            label="Reading (Furigana/Romaji)"
            value={reading}
            onChangeText={setReading}
            placeholder="e.g. いぬ"
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
  autocompleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: -8,
  },
  loader: {
    marginLeft: 12,
  },
  buttonContainer: {
    marginTop: 16,
  },
}));