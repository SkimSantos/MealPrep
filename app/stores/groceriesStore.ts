import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

export type GroceryItem = {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  checked: boolean;
};

const STORAGE_KEY = "@groceries_state_v1";

async function loadGroceries(): Promise<GroceryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    return [];
  } catch {
    return [];
  }
}

async function saveGroceries(items: GroceryItem[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useGroceries() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const isHydratingRef = useRef(true);
  const hasEverSavedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      isHydratingRef.current = true;
      const g = await loadGroceries();
      if (!alive) return;
      setItems(g);
      setHydrated(true);
      setReady(true);
      isHydratingRef.current = false;
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (isHydratingRef.current) return;
    if (!hasEverSavedRef.current) {
      hasEverSavedRef.current = true;
      return;
    }
    void saveGroceries(items);
  }, [hydrated, items]);

  const addItem = (item: GroceryItem) => {
    setItems(prev => [...prev, item]);
  };

  const updateItem = (id: string, patch: Partial<GroceryItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const clearChecked = () => {
    setItems(prev => prev.filter(i => !i.checked));
  };

  const clearAll = () => setItems([]);

  return {
    ready,
    items,
    addItem,
    updateItem,
    removeItem,
    toggleItem,
    clearChecked,
    clearAll,
  };
}
