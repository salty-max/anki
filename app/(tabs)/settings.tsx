import React from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { StyleSheet, useUnistyles, UnistylesRuntime } from 'react-native-unistyles';
import { CardView } from '../../src/components/CardView';
import { Moon, Sun } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme } = useUnistyles();
  const isDark = UnistylesRuntime.themeName === 'dark';

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    UnistylesRuntime.setTheme(newTheme);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <CardView>
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              {isDark ? (
                <Moon size={20} color={theme.colors.text} style={styles.icon} />
              ) : (
                <Sun size={20} color={theme.colors.text} style={styles.icon} />
              )}
              <View>
                <Text style={styles.sectionTitle}>Appearance</Text>
                <Text style={styles.subtext}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.card}
            />
          </View>
        </CardView>

        <CardView style={styles.card}>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 18,
    color: theme.colors.text,
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
    marginTop: 2,
  },
}));
