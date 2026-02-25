// lib/ingredientsStore.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

/** ----- Types ----- */
export type Item = {
  id: string;
  label: string;
  checked: boolean;
  baseQty?: number;
  unit?: string;
  weight?: number; // proportional weight for calculation
};

export type Section = {
  id: string;
  title: string;
  items: Item[];
};

export type Meal = {
  id: string;      // e.g. "breakfast"
  title: string;   // e.g. "Breakfast"
  sections: Section[];
};

type PersistedState = {
  meals: Meal[];
};

type IngredientsContextType = {
  ready: boolean;
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  removeMeal: (mealId: string) => void;
  renameMeal: (mealId: string, title: string) => void;
  addSection: (mealId: string, section: Section) => void;
  removeSection: (mealId: string, sectionId: string) => void;
  renameSection: (mealId: string, sectionId: string, title: string) => void;
  addItem: (mealId: string, sectionId: string, item: Item) => void;
  removeItem: (mealId: string, sectionId: string, itemId: string) => void;
  updateItem: (mealId: string, sectionId: string, itemId: string, patch: Partial<Item>) => void;
  resetMeals: () => void;
  clearMealContents: () => void;
  toggleItem: (mealId: string, sectionId: string, itemId: string) => void;
};

const IngredientsContext = createContext<IngredientsContextType | null>(null);

const STORAGE_KEY = "@ingredients_state_v2";

/** ----- Defaults ----- */
const DEFAULT_MEALS: Meal[] = [
  {
    id: "Breakfast",
    title: "Breakfast",
    sections: [],
  },
  {
    id: "Lunch",
    title: "Lunch",
    sections: [],
  },
  {
    id: "Snack",
    title: "Snack",
    sections: [],
  },
  {
    id: "Dinner",
    title: "Dinner",
    sections: [],
  },
];

const DEFAULT_STATE: PersistedState = {
  meals: DEFAULT_MEALS,
};

/** ----- Persistence & migration ----- */
async function loadState(): Promise<PersistedState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      return {
        meals: parsed.meals?.length ? parsed.meals : DEFAULT_STATE.meals,
      };
    }

    return DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

async function saveState(state: PersistedState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** ----- Provider Component ----- */
export function IngredientsProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>(DEFAULT_STATE.meals);
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const isHydratingRef = useRef(true);
  const hasEverSavedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      isHydratingRef.current = true;
      const s = await loadState();
      if (!alive) return;
      setMeals(s.meals);
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
    void saveState({ meals });
  }, [hydrated, meals]);

  /** ---- meal mutations ---- */
  const addMeal = (meal: Meal) => setMeals(prev => [...prev, meal]);
  const removeMeal = (mealId: string) => {
    setMeals(prev => prev.filter(m => m.id !== mealId));
  };
  const renameMeal = (mealId: string, title: string) =>
    setMeals(prev => prev.map(m => (m.id === mealId ? { ...m, title } : m)));

  /** ---- section mutations ---- */
  const addSection = (mealId: string, section: Section) =>
    setMeals(prev => prev.map(m => (m.id === mealId ? { ...m, sections: [...m.sections, section] } : m)));

  const removeSection = (mealId: string, sectionId: string) =>
    setMeals(prev =>
      prev.map(m =>
        m.id === mealId ? { ...m, sections: m.sections.filter(s => s.id !== sectionId) } : m
      )
    );

  const renameSection = (mealId: string, sectionId: string, title: string) =>
    setMeals(prev =>
      prev.map(m =>
        m.id !== mealId
          ? m
          : { ...m, sections: m.sections.map(s => (s.id === sectionId ? { ...s, title } : s)) }
      )
    );

  /** ---- item mutations ---- */
  const addItem = (mealId: string, sectionId: string, newItem: Item) =>
    setMeals(prev =>
      prev.map(m =>
        m.id !== mealId
          ? m
          : {
              ...m,
              sections: m.sections.map(s =>
                s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
              ),
            }
      )
    );

  const removeItem = (mealId: string, sectionId: string, itemId: string) =>
    setMeals(prev =>
      prev.map(m =>
        m.id !== mealId
          ? m
          : {
              ...m,
              sections: m.sections.map(s =>
                s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
              ),
            }
      )
    );

  const updateItem = (mealId: string, sectionId: string, itemId: string, patch: Partial<Item>) =>
    setMeals(prev =>
      prev.map(m =>
        m.id !== mealId
          ? m
          : {
              ...m,
              sections: m.sections.map(s =>
                s.id !== sectionId
                  ? s
                  : { ...s, items: s.items.map(i => (i.id === itemId ? { ...i, ...patch } : i)) }
              ),
            }
      )
    );

    const resetMeals = () => setMeals(DEFAULT_STATE.meals);

  const clearMealContents = () => setMeals(prev => 
    prev.map(m => ({ ...m, sections: [] }))
  );

  const toggleItem = (mealId: string, sectionId: string, itemId: string) =>
    updateItem(mealId, sectionId, itemId, { checked: !getItemChecked(meals, mealId, sectionId, itemId) });

  return (
    <IngredientsContext.Provider value={{
      ready,
      meals,
      addMeal,
      removeMeal,
      renameMeal,
      addSection,
      removeSection,
      renameSection,
      addItem,
      removeItem,
      updateItem,
      resetMeals,
      clearMealContents,
      toggleItem,
    }}>
      {children}
    </IngredientsContext.Provider>
  );
}

export function useIngredients(): IngredientsContextType {
  const ctx = useContext(IngredientsContext);
  if (!ctx) {
    throw new Error("useIngredients must be used within an IngredientsProvider");
  }
  return ctx;
}

// small helper to read current checked
function getItemChecked(meals: Meal[], mealId: string, sectionId: string, itemId: string) {
  const meal = meals.find(m => m.id === mealId);
  const section = meal?.sections.find(s => s.id === sectionId);
  return section?.items.find(i => i.id === itemId)?.checked ?? false;
}

/** ----- qty scaler (kept from earlier) ----- */
export function scaleQty(baseQty: number | undefined, servings: number, baseServings = 2) {
  if (baseQty == null) return "";
  const scaled = +(baseQty * (servings / baseServings)).toFixed(2);
  const s = String(scaled);
  return s.includes(".") ? s.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1") : s;
}

/**
 * Calculate proportional quantity for selected items in a section.
 * Uses weight field for proportional distribution.
 * @param items - all items in the section
 * @param itemId - the specific item to calculate qty for
 * @returns formatted quantity string with unit
 */
export function calculateProportionalQty(items: Item[], itemId: string): string {
  const selectedItems = items.filter(i => i.checked);
  const item = items.find(i => i.id === itemId);
  
  if (!item || !item.checked || !item.baseQty) return "";
  
  // Calculate total weight of selected items
  const totalWeight = selectedItems.reduce((sum, i) => sum + (i.weight ?? 1), 0);
  
  // Guard against division by zero
  if (totalWeight === 0) return "";
  
  const itemWeight = item.weight ?? 1;
  
  // Proportional calculation: (itemWeight / totalWeight) * baseQty
  // This distributes the base quantity proportionally
  const proportionalQty = (itemWeight / totalWeight) * item.baseQty;
  const scaled = +proportionalQty.toFixed(2);
  
  const s = String(scaled);
  const qty = s.includes(".") ? s.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1") : s;
  
  return `${qty} ${item.unit ?? ""}`.trim();
}
