import { create } from 'zustand';
import { db } from '../db';
import { cards } from '../db/schema';
import { eq } from 'drizzle-orm';

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;

interface CardStore {
  cards: Card[];
  isLoading: boolean;
  loadCards: () => Promise<void>;
  addCard: (card: Omit<NewCard, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  deleteCard: (id: number) => Promise<void>;
  reviewCard: (id: number, remembered: boolean) => Promise<void>;
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  isLoading: true,
  loadCards: async () => {
    set({ isLoading: true });
    try {
      const allCards = await db.select().from(cards).orderBy(cards.createdAt);
      set({ cards: allCards, isLoading: false });
    } catch (error) {
      console.error('Failed to load cards:', error);
      set({ isLoading: false });
    }
  },
  addCard: async (newCard) => {
    try {
      await db.insert(cards).values({
        ...newCard,
        dueAt: Date.now(),
        status: 'new',
      });
      await get().loadCards();
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  },
  deleteCard: async (id) => {
    try {
      await db.delete(cards).where(eq(cards.id, id));
      await get().loadCards();
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  },
  reviewCard: async (id, remembered) => {
    try {
      const card = get().cards.find(c => c.id === id);
      if (!card) return;

      const now = Date.now();
      let nextDue = now;
      let newStatus = card.status;

      if (remembered) {
        // Simple spaced repetition
        const hoursToAdd = card.status === 'new' ? 24 : 
                           card.status === 'learning' ? 24 * 3 : 
                           24 * 7;
        nextDue = now + hoursToAdd * 60 * 60 * 1000;
        newStatus = card.status === 'new' ? 'learning' : 'graduated';
      } else {
        nextDue = now + 10 * 60 * 1000; // 10 minutes
        newStatus = 'learning';
      }

      await db.update(cards)
        .set({ 
          lastReviewedAt: now, 
          dueAt: nextDue,
          status: newStatus 
        })
        .where(eq(cards.id, id));
      
      await get().loadCards();
    } catch (error) {
      console.error('Failed to update card review:', error);
    }
  }
}));