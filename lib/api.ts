import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://notehub-api.goit.global';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tag?: string;
}

export async function fetchNotes(
  page: number = 1,
  perPage: number = 12,
  search: string = '',
  tag?: string
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (tag && tag !== 'all') {
    params.tag = tag;
  }

  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
}

/**
 * Отримання однієї нотатки за її ID.
 */
export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

/**
 * Отримання нотаток за конкретним тегом.
 */
export async function fetchNotesByTag(
  tag: string,
  page: number = 1,
  perPage: number = 12
): Promise<Note[]> {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (tag && tag !== 'all') {
    params.tag = tag;
  }

  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data.notes;
}

/**
 * Створення нової нотатки.
 */
export async function createNote(data: CreateNoteDto): Promise<Note> {
  const response = await api.post<Note>('/notes', data);
  return response.data;
}

/**
 * Видалення нотатки за її ID.
 */
export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}