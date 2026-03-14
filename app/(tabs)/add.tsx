import React, { useState, useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Modal, Pressable, Text as RNText } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useNetInfo } from '@react-native-community/netinfo';
import { useCardStore } from '../../src/store';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { CardView } from '../../src/components/CardView';
import { Search, Plus, X } from 'lucide-react-native';

interface JishoResult {
  japanese: { word?: string; reading?: string }[];
  senses: { english_definitions: string[] }[];
}

export default function AddScreen() {
  const [japanese, setJapanese] = useState('');
  const [reading, setReading] = useState('');
  const [meaning, setMeaning] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<JishoResult[]>([]);
  
  const addCard = useCardStore(state => state.addCard);
  const router = useRouter();
  const { theme } = useUnistyles();
  const { isConnected } = useNetInfo();

  const handleSearch = useCallback(async () => {
    if (isConnected === false) {
      Alert.alert('Offline', 'Dictionary autocomplete requires an internet connection.');
      return;
    }

    if (!meaning.trim()) {
      Alert.alert('Error', 'Please enter an English meaning first to search.');
      return;
    }

    setIsFetching(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_JISHO_API_URL || 'https://jisho.org/api/v1/search/words';
      const searchTerm = meaning.trim().toLowerCase();
      
      const [exactResponse, wildcardResponse] = await Promise.all([
        fetch(`${apiUrl}?keyword=${encodeURIComponent(searchTerm)}`),
        fetch(`${apiUrl}?keyword=${encodeURIComponent(searchTerm)}%20*`)
      ]);
      
      const exactJson = await exactResponse.json();
      const wildcardJson = await wildcardResponse.json();
      
      let results: JishoResult[] = [];
      if (exactJson.data && exactJson.data.length > 0) {
        results = [...exactJson.data];
      }
      if (wildcardJson.data && wildcardJson.data.length > 0) {
        results = [...results, ...wildcardJson.data];
      }

      if (results.length > 0) {
        setSearchResults(results.slice(0, 10)); // Limit to 10 results
        setResultsModalVisible(true);
      } else {
        Alert.alert('Not Found', 'No dictionary results found for that meaning.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch autocomplete data. Check your connection.');
    } finally {
      setIsFetching(false);
    }
  }, [meaning, isConnected]);

  const handleSelectResult = useCallback((result: JishoResult) => {
    const jp = result.japanese[0];
    if (jp) {
      setJapanese(jp.word || jp.reading || '');
      setReading(jp.reading || '');
    }
    setResultsModalVisible(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setResultsModalVisible(false);
    setSearchResults([]);
  }, []);

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
            onSubmitEditing={handleSearch}
          />
          
          <View style={styles.autocompleteContainer}>
             <Button 
               title={isConnected === false ? "Offline (Dictionary Disabled)" : isFetching ? "Searching..." : "Search Dictionary"} 
               variant="secondary" 
               icon={<Search size={16} color={theme.colors.text} />}
               onPress={handleSearch} 
               disabled={isFetching || isConnected === false}
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
            label="Reading (Furigana)"
            value={reading}
            onChangeText={setReading}
            placeholder="e.g. いぬ"
          />
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Add Flashcard" 
              icon={<Plus size={18} color={theme.colors.primaryText} />}
              onPress={handleAdd} 
            />
          </View>
        </CardView>
      </ScrollView>

      <Modal
        visible={resultsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHeader}>
              <RNText style={[styles.modalTitle, { color: theme.colors.text }]}>Select a word</RNText>
              <Pressable onPress={handleCloseModal}>
                <X size={24} color={theme.colors.muted} />
              </Pressable>
            </View>
            <ScrollView style={styles.resultsList}>
              {searchResults.map((result, index) => {
                const jp = result.japanese[0];
                const defs = result.senses[0]?.english_definitions || [];
                return (
                  <Pressable
                    key={index}
                    style={[styles.resultItem, { borderBottomColor: theme.colors.border }]}
                    onPress={() => handleSelectResult(result)}
                  >
                    <RNText style={[styles.resultJapanese, { color: theme.colors.text }]}>
                      {jp?.word || jp?.reading || ''}
                    </RNText>
                    <RNText style={[styles.resultReading, { color: theme.colors.muted }]}>
                      {jp?.reading || ''}
                    </RNText>
                    <RNText style={[styles.resultMeaning, { color: theme.colors.text }]} numberOfLines={1}>
                      {defs.slice(0, 3).join(', ')}
                    </RNText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 18,
  },
  resultsList: {
    paddingHorizontal: 16,
  },
  resultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultJapanese: {
    fontFamily: theme.typography.boldJapanese,
    fontSize: 20,
  },
  resultReading: {
    fontFamily: theme.typography.fontFamilyJapanese,
    fontSize: 14,
    marginTop: 2,
  },
  resultMeaning: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    marginTop: 4,
  },
}));