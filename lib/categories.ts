export interface CategoryMeta {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'roads',       label: 'Roads',        emoji: '🛣️',  color: '#EF4444' },
  { id: 'garbage',     label: 'Garbage',      emoji: '🗑️',  color: '#F97316' },
  { id: 'streetlight', label: 'Street Light', emoji: '💡',  color: '#EAB308' },
  { id: 'water',       label: 'Water',        emoji: '💧',  color: '#3B82F6' },
  { id: 'safety',      label: 'Safety',       emoji: '⚠️',  color: '#8B5CF6' },
  { id: 'theft',       label: 'Theft',        emoji: '🔓',  color: '#EC4899' },
  { id: 'other',       label: 'Other',        emoji: '📍',  color: '#6B7280' },
];

export function getCategoryById(id: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
