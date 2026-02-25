import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

export type HistoryIngredient = {
  id: string;
  label: string;
  quantity: number;
  unit: string;
};

export type HistoryEntry = {
  id: string;
  mealType: string;
  date: string; // ISO date string
  ingredients: HistoryIngredient[];
  notes: string;
};

type HistoryContextType = {
  ready: boolean;
  entries: HistoryEntry[];
  addEntry: (entry: HistoryEntry) => void;
  updateEntry: (id: string, patch: Partial<HistoryEntry>) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
};

const HistoryContext = createContext<HistoryContextType | null>(null);

const STORAGE_KEY = "@history_state_v1";

async function loadHistory(): Promise<HistoryEntry[]> {
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

async function saveHistory(entries: HistoryEntry[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const isHydratingRef = useRef(true);
  const hasEverSavedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      isHydratingRef.current = true;
      const h = await loadHistory();
      if (!alive) return;
      setEntries(h);
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
    void saveHistory(entries);
  }, [hydrated, entries]);

  const addEntry = (entry: HistoryEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const updateEntry = (id: string, patch: Partial<HistoryEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const clearHistory = () => setEntries([]);

  return (
    <HistoryContext.Provider value={{ ready, entries, addEntry, updateEntry, removeEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextType {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return ctx;
}
