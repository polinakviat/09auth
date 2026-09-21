'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes } from '@/lib/api';
import type { Note } from '@/types/note';

import { NoteList } from '@/components/NoteList/NoteList';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import { Pagination } from '@/components/Pagination/Pagination';

import css from './NotesPage.module.css'; // Переконайтеся в правильності імпорту CSS

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  // 1. Стани залишено виключно для пагінації та пошуку
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const perPage = 12;

  // 2. Debounce для пошукового інпуту зі скиданням на 1 сторінку
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  // 3. Запит до API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', page, searchQuery, tag],
    queryFn: () => fetchNotes(page, perPage, searchQuery, tag),
    placeholderData: keepPreviousData,
  });

  const notes: Note[] = data?.notes || [];
  const totalPages: number = data?.totalPages || 0;

  return (
    <div className={css.container}>
      {/* Пошук та кнопка-посилання на сторінку створення */}
      <div className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.createButton}>
          Create note +
        </Link>
      </div>

      {/* Індикатори стану */}
      {isLoading && <p className={css.statusText}>Завантаження нотаток...</p>}

      {isError && (
        <p className={css.errorText}>
          Помилка завантаження: {error instanceof Error ? error.message : 'Невідома помилка'}
        </p>
      )}

      {/* Список нотаток */}
      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} />
      )}

      {/* Повідомлення про відсутність нотаток */}
      {!isLoading && !isError && notes.length === 0 && (
        <p className={css.statusText}>Нотаток не знайдено.</p>
      )}

      {/* Пагінація */}
      {!isLoading && !isError && totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </div>
  );
}