import React from 'react';
import { View, Text, ScrollView, Alert, Linking } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { CardView } from '../../src/components/CardView';

export default function SettingsScreen() {
  const { theme } = useUnistyles();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <CardView>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.text}>Anki - Japanese Vocabulary Flashcards</Text>
          <Text style={styles.subtext}>Version 1.0.0</Text>
        </CardView>

        <CardView style={styles.card}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.text}>
            • Add vocabulary words using the Add tab{'\n'}
            • Filter your deck by status (New, Learning, Graduated){'\n'}
            • Take quizzes to reinforce your memory{'\n'}
            • Spaced repetition helps you remember longer
          </Text>
        </CardView>

        <CardView style={styles.card}>
          <Text style={styles.sectionTitle}>Data</Text>
          <Text style={styles.text}>
            All your vocabulary is stored locally on your device. No internet is required to study.
          </Text>
        </CardView>

        <CardView style={styles.card}>
          <Text style={styles.sectionTitle}>Dictionary</Text>
          <Text style={styles.text}>
            Auto-complete powered by Jisho.org dictionary API.
          </Text>
        </CardView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    marginTop: 0,
  },
  sectionTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 12,
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  subtext: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
  },
}));
