import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

export type UserProfile = {
  name: string;
  age: number;
  weight: number;        // kg
  height: number;        // cm
  dailyCalorieGoal: number;
  dailyProteinGoal: number;   // grams
  dailyCarbsGoal: number;     // grams
  dailyFatGoal: number;       // grams
  themeOverride: 'system' | 'dark' | 'light';
};

type ProfileContextType = {
  ready: boolean;
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  resetProfile: () => void;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

const STORAGE_KEY = "@profile_state_v1";

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  age: 0,
  weight: 70,
  height: 170,
  dailyCalorieGoal: 2000,
  dailyProteinGoal: 150,
  dailyCarbsGoal: 250,
  dailyFatGoal: 65,
  themeOverride: 'system',
};

async function loadProfile(): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    }
    return DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

async function saveProfile(profile: UserProfile) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const isHydratingRef = useRef(true);
  const hasEverSavedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      isHydratingRef.current = true;
      const p = await loadProfile();
      if (!alive) return;
      setProfile(p);
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
    void saveProfile(profile);
  }, [hydrated, profile]);

  const updateProfile = (patch: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...patch }));
  };

  const resetProfile = () => setProfile(DEFAULT_PROFILE);

  return (
    <ProfileContext.Provider value={{ ready, profile, updateProfile, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextType {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}
