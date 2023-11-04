import { create } from "zustand";

interface useCategoryModalStore {
  isOpen: boolean;
  categoryTitle: string | null | undefined;
  categoryId: string | null | undefined;
  onOpen: () => void;
  onClose: () => void;
  setCategoryTitle: (_title: string | null | undefined) => void;
  setCategoryId: (_id: string | null | undefined) => void;
}

export const useCategoryModal = create<useCategoryModalStore>((set) => ({
  isOpen: false,
  categoryTitle: null,
  categoryId: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setCategoryTitle: (_title) => set({ categoryTitle: _title }),
  setCategoryId: (_id) => set({ categoryId: _id }),
}));
