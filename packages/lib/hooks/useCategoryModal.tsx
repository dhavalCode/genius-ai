import { create } from "zustand";

interface useCategoryModalStore {
  isOpen: boolean;
  title: string | null | undefined;
  onOpen: () => void;
  onClose: () => void;
  setTitle: (_title: string | null | undefined) => void;
}

export const useCategoryModal = create<useCategoryModalStore>((set) => ({
  isOpen: false,
  title: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setTitle: (_title) => set({ title: _title }),
}));
