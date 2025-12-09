import { ProfileData, ProfileHistory } from '@/types/profile';

const STORAGE_KEY = 'capstone_profile_data';
const HISTORY_KEY = 'capstone_profile_data_history';

export const profileStorage = {
  get: (): ProfileData | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading profile data:', error);
      return null;
    }
  },

  set: (data: ProfileData): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving profile data:', error);
      throw new Error('Failed to save profile. Storage quota may be exceeded.');
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },

  getHistory: (): ProfileHistory[] => {
    if (typeof window === 'undefined') return [];
    try {
      const history = localStorage.getItem(HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading profile history:', error);
      return [];
    }
  },

  addHistory: (data: ProfileData): void => {
    if (typeof window === 'undefined') return;
    try {
      const history = profileStorage.getHistory();
      const newEntry: ProfileHistory = {
        ...data,
        changedAt: new Date().toISOString(),
      };
      history.push(newEntry);
      
      // Keep only last 10 entries
      const limitedHistory = history.slice(-10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error saving profile history:', error);
    }
  },
};
