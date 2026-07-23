import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GroupState {
  selectedGroupId: string | null;
  setSelectedGroupId: (groupId: string) => void;
  clearSelectedGroup: () => void;
}

export const useGroupStore = create<GroupState>()(
  persist(
    set => ({
      selectedGroupId: null,
      setSelectedGroupId: groupId => set({ selectedGroupId: groupId }),
      clearSelectedGroup: () => set({ selectedGroupId: null }),
    }),
    { name: 'gachi-salim-group' },
  ),
);
