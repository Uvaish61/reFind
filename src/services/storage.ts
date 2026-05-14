import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedItem } from '../types';

const STORAGE_KEY = '@refind_items';

export async function getAllItems(): Promise<SavedItem[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveItem(item: SavedItem): Promise<void> {
  const items = await getAllItems();
  items.unshift(item); // newest first
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function deleteItem(id: string): Promise<void> {
  const items = await getAllItems();
  const updated = items.filter(i => i.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function updateItem(updated: SavedItem): Promise<void> {
  const items = await getAllItems();
  const index = items.findIndex(i => i.id === updated.id);
  if (index !== -1) {
    items[index] = updated;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}
