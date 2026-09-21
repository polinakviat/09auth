import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DraftNote {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

interface NoteStore {
  draft: DraftNote;
  setDraft: (note: Partial<DraftNote>) => void;
  clearDraft: () => void;
}

const initialDraft: DraftNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      // Оновлення полів чернетки із збереженням попередніх значень
      setDraft: (note) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...note,
          },
        })),

      // Скидання чернетки до початкового стану
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft-storage', // Ключ у localStorage
      partialize: (state) => ({ draft: state.draft }), // Зберігаємо лише об'єкт draft без екшенів/методів
    }
  )
);