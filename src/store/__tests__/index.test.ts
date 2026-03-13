import { useCardStore } from '../index';
import { db } from '../../db';

jest.mock('../../db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
  expoDb: {},
}));

jest.mock('drizzle-orm', () => ({
  eq: jest.fn((col, val) => ({ col, val })),
}));

describe('useCardStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCardStore.setState({ cards: [], isLoading: true });
    
    // Reset mocks
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const state = useCardStore.getState();
    expect(state.cards).toEqual([]);
    expect(state.isLoading).toBe(true);
  });

  it('loads cards successfully', async () => {
    const mockCards = [
      { id: 1, japanese: '猫', meaning: 'cat', status: 'new', dueAt: Date.now() }
    ];
    
    // Mock the chaining .from().orderBy()
    const orderByMock = jest.fn().mockResolvedValue(mockCards);
    const fromMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
    (db.select as jest.Mock).mockReturnValue({ from: fromMock });

    await useCardStore.getState().loadCards();

    const state = useCardStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.cards).toEqual(mockCards);
    expect(db.select).toHaveBeenCalled();
  });

  it('adds a card', async () => {
    // Setup select mock to return a new card list after add
    const orderByMock = jest.fn().mockResolvedValue([]);
    const fromMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
    (db.select as jest.Mock).mockReturnValue({ from: fromMock });
    
    const valuesMock = jest.fn().mockResolvedValue({});
    (db.insert as jest.Mock).mockReturnValue({ values: valuesMock });

    await useCardStore.getState().addCard({
      japanese: '犬',
      reading: 'inu',
      meaning: 'dog'
    });

    expect(db.insert).toHaveBeenCalled();
    expect(valuesMock).toHaveBeenCalledWith(expect.objectContaining({
      japanese: '犬',
      reading: 'inu',
      meaning: 'dog',
      status: 'new'
    }));
  });

  it('deletes a card', async () => {
    const orderByMock = jest.fn().mockResolvedValue([]);
    const fromMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
    (db.select as jest.Mock).mockReturnValue({ from: fromMock });

    const whereMock = jest.fn().mockResolvedValue({});
    (db.delete as jest.Mock).mockReturnValue({ where: whereMock });

    await useCardStore.getState().deleteCard(1);

    expect(db.delete).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
  });
});
