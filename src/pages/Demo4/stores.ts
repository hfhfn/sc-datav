import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface DrillProvince {
  adcode: string;
  name: string;
}

interface ConfigStore {
  mapPlayComplete: boolean;
  selectedSpotId: string | null;
  drillProvince: DrillProvince | null;
  viewResetNonce: number;
  selectSpot: (id: string | null) => void;
  setDrillProvince: (province: DrillProvince | null) => void;
  resetView: () => void;
  reset: () => void;
}

export const useConfigStore = create<ConfigStore>()(
  subscribeWithSelector((set, _, store) => ({
    mapPlayComplete: false,
    selectedSpotId: null,
    drillProvince: null,
    viewResetNonce: 0,
    selectSpot: (id) =>
      set((s) => ({ selectedSpotId: s.selectedSpotId === id ? null : id })),
    setDrillProvince: (province) =>
      set({
        drillProvince: province,
        selectedSpotId: null,
      }),
    resetView: () => set((s) => ({ viewResetNonce: s.viewResetNonce + 1 })),
    reset: () => set(store.getInitialState()),
  }))
);
