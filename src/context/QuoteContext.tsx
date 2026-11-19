import React, { createContext, useContext, useState, useEffect } from 'react';
import { CatalogItem, CartItem } from '../types';

interface QuoteContextType {
  items: CartItem[];
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (item: CatalogItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalDistinct: number;
  lastAddedItem: CatalogItem | null;
  selectedProductForModal: CatalogItem | null;
  openProductModal: (item: CatalogItem) => void;
  closeProductModal: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rei_do_copo_quote');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CatalogItem | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<CatalogItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('rei_do_copo_quote', JSON.stringify(items));
    } catch {
      // Storage error ignored
    }
  }, [items]);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen(prev => !prev);

  const addItem = (item: CatalogItem, quantity = 100) => {
    setItems(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { item, quantity }];
    });

    setLastAddedItem(item);
    setTimeout(() => {
      setLastAddedItem(null);
    }, 2500);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.item.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openProductModal = (item: CatalogItem) => {
    setSelectedProductForModal(item);
  };

  const closeProductModal = () => {
    setSelectedProductForModal(null);
  };

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalDistinct = items.length;

  return (
    <QuoteContext.Provider
      value={{
        items,
        isOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalDistinct,
        lastAddedItem,
        selectedProductForModal,
        openProductModal,
        closeProductModal,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};
