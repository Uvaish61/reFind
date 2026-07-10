import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedItem, Collection } from '../types';

const STORAGE_KEY = '@refind_items';
const COLLECTIONS_KEY = '@refind_collections';

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

export async function getAllCollections(): Promise<Collection[]> {
  const json = await AsyncStorage.getItem(COLLECTIONS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveCollection(collection: Collection): Promise<void> {
  const collections = await getAllCollections();
  collections.unshift(collection);
  await AsyncStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
}

export async function deleteCollection(id: string): Promise<void> {
  const collections = await getAllCollections();
  const updated = collections.filter(c => c.id !== id);
  await AsyncStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
}

export async function updateCollection(updated: Collection): Promise<void> {
  const collections = await getAllCollections();
  const index = collections.findIndex(c => c.id === updated.id);
  if (index !== -1) {
    collections[index] = updated;
    await AsyncStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  }
}

export async function getItemCountForCollection(collectionName: string): Promise<number> {
  const items = await getAllItems();
  return items.filter(i => i.collection === collectionName).length;
}

export async function findItemByUrl(url: string): Promise<SavedItem | null> {
  const items = await getAllItems();
  return items.find(i => i.url === url) ?? null;
}
