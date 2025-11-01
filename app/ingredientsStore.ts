// lib/ingredientsStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

/** ----- Types ----- */
export type Item = {
  id: string;
  label: string;
  checked: boolean;
  baseQty?: number;
  unit?: string;
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

const STORAGE_KEY = "@ingredients_state_v2";

/** ----- Defaults ----- */
const DEFAULT_MEALS: Meal[] = [
  {
    id: "Breakfast",
    title: "Breakfast",
    sections: [
      {
        id: "selection1",
        title: "Selection 1",
        items: [
          { id: "broccoli", label: "Broccoli Florets", checked: false, baseQty: 2, unit: "cups" },
          { id: "carrots", label: "Sliced Carrots", checked: false, baseQty: 1, unit: "cup" },
          { id: "onion", label: "Diced Onion", checked: false, baseQty: 0.5, unit: "cup" },
        ],
      },
      {
        id: "selection2",
        title: "Selection 2",
        items: [
          { id: "broccoli", label: "Broccoli Florets", checked: false, baseQty: 2, unit: "cups" },
          { id: "carrots", label: "Sliced Carrots", checked: false, baseQty: 1, unit: "cup" },
          { id: "onion", label: "Diced Onion", checked: false, baseQty: 0.5, unit: "cup" },
        ],
      },
    ],
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

/** ----- Hook API ----- */
export function useIngredients() {
  const [meals, setMeals] = useState<Meal[]>(DEFAULT_STATE.meals);
  const [ready, setReady] = useState(false);

  // NEW: hydration + first-save guard
  const [hydrated, setHydrated] = useState(false);
  const isHydratingRef = useRef(true);
  const hasEverSavedRef = useRef(false);

  // 1) Load once (even if StrictMode remounts, we guard saves)
  useEffect(() => {
    let alive = true;
    (async () => {
      isHydratingRef.current = true;
      const s = await loadState();
      if (!alive) return;
      setMeals(s.meals);
      setHydrated(true);
      isHydratingRef.current = false;
    })();
    return () => { alive = false; };
  }, []);

  // 2) Auto-save ONLY after hydrated, and NEVER while hydrating
  useEffect(() => {
    if (!hydrated) return;           // not hydrated yet
    if (isHydratingRef.current) return; // actively hydrating
    // Optional: avoid saving immediately after hydration once (helps with StrictMode double mount)
    if (!hasEverSavedRef.current) {
      hasEverSavedRef.current = true;
      return;
    }
    void saveState({ meals });
  }, [hydrated, meals ]);


  // initial load
  useEffect(() => {
    (async () => {
      const s = await loadState();
      setMeals(s.meals);
      setReady(true);
    })();
  }, []);

  // auto-save
  useEffect(() => {
    if (!ready) return;
    void saveState({ meals });
  }, [ready, meals]);

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

  const toggleItem = (mealId: string, sectionId: string, itemId: string) =>
    updateItem(mealId, sectionId, itemId, {});

  return {
    ready,
    meals,
    // meal CRUD
    addMeal,
    removeMeal,
    renameMeal,
    // section CRUD
    addSection,
    removeSection,
    renameSection,
    // item CRUD
    addItem,
    removeItem,
    updateItem,
    resetMeals,
    toggleItem: (mealId: string, sectionId: string, itemId: string) =>
      updateItem(mealId, sectionId, itemId, { checked: !getItemChecked(meals, mealId, sectionId, itemId) }),
  };
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
