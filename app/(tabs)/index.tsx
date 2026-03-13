import React, { useEffect, useCallback, memo } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useCardStore, Card } from '../../src/store';
import { CardView } from '../../src/components/CardView';
import { Button } from '../../src/components/Button';
import { useShallow } from 'zustand/react/shallow';

const MemoizedCardItem = memo(({ item, onDelete }: { item: Card; onDelete: (id: number) => void }) => {
  return (
    <CardView style={styles.cardItem}>
      <View style={styles.cardHeader}>
        <Text style={styles.japanese}>{item.japanese}</Text>
        <Button variant="danger" title="Delete" onPress={() => onDelete(item.id)} />
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
  const { cards, loadCards, isLoading, deleteCard } = useCardStore(
    useShallow((state) => ({
      cards: state.cards,
      loadCards: state.loadCards,
      isLoading: state.isLoading,
      deleteCard: state.deleteCard,
    }))
  );
  
  const { theme } = useUnistyles();

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const keyExtractor = useCallback((item: Card) => item.id.toString(), []);

  const renderItem = useCallback(({ item }: { item: Card }) => (
    <MemoizedCardItem item={item} onDelete={deleteCard} />
  ), [deleteCard]);

  const ListEmptyComponent = useCallback(() => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Your deck is empty. Add some words!</Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
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