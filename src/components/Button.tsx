import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ title, variant = 'primary', style, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      style={(state) => {
        const baseStyle = [styles.container(variant), state.pressed && styles.pressed];
        const passedStyle = typeof style === 'function' ? style(state) : style;
        return [...baseStyle, passedStyle];
      }}
    >
      <Text style={styles.text(variant)}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: (variant: 'primary' | 'secondary' | 'danger') => ({
    backgroundColor: variant === 'primary' ? theme.colors.primary : variant === 'danger' ? theme.colors.danger : theme.colors.card,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: variant === 'secondary' ? 1 : 0,
    borderColor: theme.colors.border,
  }),
  text: (variant: 'primary' | 'secondary' | 'danger') => ({
    color: variant === 'primary' ? theme.colors.primaryText : theme.colors.text,
    fontFamily: theme.typography.bold,
    fontSize: 16,
  }),
  pressed: {
    opacity: 0.8,
  },
}));