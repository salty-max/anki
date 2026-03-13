# Anki - Japanese Vocabulary Flashcards

A sleek, modern React Native application built with Expo for learning Japanese vocabulary through flashcards. Users can add new words and test their memory using a high-performance, 3D card-flipping quiz interface powered by a local database.

## Features

- **Vocabulary Deck**: View, manage, and delete your saved Japanese vocabulary.
- **Add Words**: Clean, intuitive form to input Kanji/Kana, reading (Furigana/Romaji), and meaning.
- **Spaced Repetition Quiz**: 
  - Test yourself in highly-focused, 10-word sessions.
  - Interactive 3D flip animations using `react-native-reanimated`.
  - Smart scheduling queue based on "Remembered" or "Forgot" actions.
- **Offline First**: All data is stored locally using SQLite.
- **Slick UI**: "shadcn/ui" inspired aesthetic, dark-mode default, utilizing Unistyles.

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/)
- **Package Manager**: [Bun](https://bun.sh/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) (using optimized `useShallow` selectors)
- **Database**: `expo-sqlite` + [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [React Native Unistyles v3](https://www.unistyl.es/)
- **Animations**: `react-native-reanimated`
- **Testing**: Jest + React Native Testing Library + Bun test runner (in CI)

## Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd anki
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the Expo development server:
   ```bash
   bun run start
   ```

4. Press `a` to open in an Android Emulator, `i` to open in the iOS Simulator, or scan the QR code with the Expo Go app on your physical device.

## Testing

The application includes unit tests for the Zustand state management store, completely mocking out the SQLite database layer to ensure fast, reliable execution.

To run the tests:

```bash
bun run test
```

## Continuous Integration

This project includes a GitHub Actions CI pipeline (`.github/workflows/ci.yml`) that automatically runs on pushes and pull requests to the `main` branch. It ensures that dependencies install correctly, type-checking (`tsc --noEmit`) passes, and all Jest unit tests succeed.