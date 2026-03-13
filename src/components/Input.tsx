import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface InputProps extends TextInputProps {
  label?: string;
}

export function Input({ label, style, ...props }: InputProps) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[styles.input, style]}
        placeholderTextColor={theme.colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: theme.typography.bold,
    color: theme.colors.text,
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
  },
}));