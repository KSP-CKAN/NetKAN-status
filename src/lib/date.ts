import { formatDistanceToNow } from 'date-fns';

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) {
    return 'N/A';
  }
  
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
}
