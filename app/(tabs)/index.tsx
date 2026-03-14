import React, { useEffect, useCallback, memo, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useCardStore, Card, CardFilter } from '../../src/store';
import { CardView } from '../../src/components/CardView';
import { Button } from '../../src/components/Button';
import { useShallow } from 'zustand/react/shallow';
import { Trash2 } from 'lucide-react-native';

const FILTER_OPTIONS: { key: CardFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'learning', label: 'Learning' },
  { key: 'graduated', label: 'Graduated' },
];

const MemoizedCardItem = memo(({ item, onDelete, theme }: { item: Card; onDelete: (id: number) => void; theme: any }) => {
  return (
    <CardView style={styles.cardItem}>
      <View style={styles.cardHeader}>
        <Text style={styles.japanese}>{item.japanese}</Text>
        <Button 
          variant="danger" 
          title="Delete" 
          icon={<Trash2 size={16} color={theme.colors.text} />}
          onPress={() => onDelete(item.id)} 
        />
      </View>
      {item.reading && <Text style={styles.reading}>{item.reading}</Text>}
      <Text style={styles.meaning}>{item.meaning}</Text>
      <View style={styles.stats}>
        <Text style={styles.statText}>Status: {item.status}</Text>
        <Text style={styles.statText}>Due: {new Date(item.dueAt!).toLocaleDateString()}</Text>
      </View>
    </CardView>
  );
});

export default function DeckScreen() {
  const { cards, filter, loadCards, isLoading, deleteCard, setFilter } = useCardStore(
    useShallow((state) => ({
      cards: state.cards,
      filter: state.filter,
      loadCards: state.loadCards,
      isLoading: state.isLoading,
      deleteCard: state.deleteCard,
      setFilter: state.setFilter,
    }))
  );
  
  const { theme } = useUnistyles();

  const filteredCards = useMemo(() => {
    if (filter === 'all') return cards;
    return cards.filter(c => c.status === filter);
  }, [cards, filter]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const keyExtractor = useCallback((item: Card) => item.id.toString(), []);

  const renderItem = useCallback(({ item }: { item: Card }) => (
    <MemoizedCardItem item={item} onDelete={deleteCard} theme={theme} />
  ), [deleteCard, theme]);

  const ListEmptyComponent = useCallback(() => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>
        {filter === 'all' ? 'Your deck is empty. Add some words!' : `No ${filter} cards found.`}
      </Text>
    </View>
  ), [filter]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {FILTER_OPTIONS.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => setFilter(option.key)}
            style={[
              styles.filterButton,
              filter === option.key && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === option.key && styles.filterTextActive,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={filteredCards}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadCards} tintColor={theme.colors.primary} />}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.muted,
  },
  filterTextActive: {
    color: theme.colors.primaryText,
    fontFamily: theme.typography.bold,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  cardItem: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  japanese: {
    fontFamily: theme.typography.boldJapanese,
    fontSize: 24,
    color: theme.colors.text,
  },
  reading: {
    fontFamily: theme.typography.fontFamilyJapanese,
    fontSize: 16,
    color: theme.colors.muted,
    marginBottom: 4,
  },
  meaning: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  statText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.muted,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.muted,
    fontSize: 16,
  },
}));