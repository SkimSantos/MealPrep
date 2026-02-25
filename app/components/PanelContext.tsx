import React, { createContext, useContext, useState, ReactNode } from 'react';

type PanelState = Record<string, boolean>;

type PanelContextType = {
  panels: PanelState;
  isPanelOpen: (panelId: string) => boolean;
  openPanel: (panelId: string, data?: any) => void;
  closePanel: (panelId: string) => void;
  togglePanel: (panelId: string) => void;
  setPanelData: (panelId: string, data: any) => void;
  getPanelData: (panelId: string) => any;
};

const PanelContext = createContext<PanelContextType | null>(null);

type PanelProviderProps = {
  children: ReactNode;
};

export function PanelProvider({ children }: PanelProviderProps) {
  const [panels, setPanels] = useState<PanelState>({});
  const [panelData, setPanelDataState] = useState<Record<string, any>>({});

  const isPanelOpen = (panelId: string) => !!panels[panelId];

  const openPanel = (panelId: string, data?: any) => {
    setPanels(prev => ({ ...prev, [panelId]: true }));
    if (data !== undefined) {
      setPanelDataState(prev => ({ ...prev, [panelId]: data }));
    }
  };

  const closePanel = (panelId: string) => {
    setPanels(prev => ({ ...prev, [panelId]: false }));
  };

  const togglePanel = (panelId: string) => {
    setPanels(prev => ({ ...prev, [panelId]: !prev[panelId] }));
  };

  const setPanelData = (panelId: string, data: any) => {
    setPanelDataState(prev => ({ ...prev, [panelId]: data }));
  };

  const getPanelData = (panelId: string) => panelData[panelId];

  return (
    <PanelContext.Provider
      value={{
        panels,
        isPanelOpen,
        openPanel,
        closePanel,
        togglePanel,
        setPanelData,
        getPanelData,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}

export function usePanels() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanels must be used within a PanelProvider');
  }
  return context;
}
