# Design Document: Japanese Flashcard App

## 1. Overview
A sleek, modern React Native application built with Expo for learning Japanese vocabulary through flashcards. Users can add new words and test their memory using a card-flipping quiz interface.

## 2. Tech Stack
- **Framework**: React Native + Expo (Latest)
- **Routing**: Expo Router
- **Styling**: React Native Unistyles v3
- **State Management**: Zustand
- **Database**: `expo-sqlite` + Drizzle ORM
- **Fonts**: Nunito (Latin/English) and Noto Sans JP (Japanese)
- **Icons**: `lucide-react-native`

## 3. Core Features
- **Vocabulary Management**:
  - Add new flashcards with fields for Japanese (Kanji/Kana), Reading (Romaji/Kana), and Meaning (English).
  - List view of all saved vocabulary.
- **Quiz Mode**:
  - Flashcard interface (tap to flip).
  - Review queue: Mark as "Remembered" or "Forgot" to cycle through words.
- **Styling & Theming**:
  - Default Dark Mode.
  - "shadcn/ui" inspired aesthetic: minimalist, subtle borders, high contrast, clean typography.

## 4. Database Schema (Drizzle ORM)
**Table: `cards`**
- `id`: Integer (Primary Key, Auto Increment)
- `japanese`: Text (Required) - e.g., "猫" or "ねこ"
- `reading`: Text - e.g., "neko"
- `meaning`: Text (Required) - e.g., "cat"
- `createdAt`: Integer (Timestamp)
- `lastReviewedAt`: Integer (Timestamp)
- `dueAt`: Integer (Timestamp) - for spaced repetition
- `status`: Text (e.g., "new", "learning", "graduated")

## 5. UI/UX Design (shadcn-like)
- **Colors (Dark Mode)**:
  - Background: `#09090b` (zinc-950)
  - Card: `#18181b` (zinc-900)
  - Border: `#27272a` (zinc-800)
  - Primary Text: `#fafafa` (zinc-50)
  - Muted Text: `#a1a1aa` (zinc-400)
  - Primary Action: `#fafafa` background with `#09090b` text.
- **Typography**:
  - English/UI elements: `Nunito`
  - Japanese characters: `Noto Sans JP`
- **Components**:
  - `Card`: Rounded corners (lg), subtle borders.
  - `Button`: Clean, no-shadow, slight hover/active opacity effects.
  - `Input`: Minimalist border, focused ring effect.

## 6. Project Structure
```text
/
├── app/               # Expo Router screens (Tabs, Modals)
├── components/        # Reusable UI components (Card, Button, Input)
├── db/                # Drizzle schema and initialization
├── store/             # Zustand state management
├── styles/            # Unistyles themes and setup
└── assets/            # Fonts and images
```
