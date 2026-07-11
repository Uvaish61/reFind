import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedItem, Collection, ArchivedItem } from '../types';

const STORAGE_KEY = '@refind_items';
const COLLECTIONS_KEY = '@refind_collections';
const ARCHIVE_KEY = '@refind_archive';

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

export async function archiveItem(id: string): Promise<void> {
  const items = await getAllItems();
  const target = items.find(i => i.id === id);
  if (!target) return;

  const archivedItem: ArchivedItem = {
    ...target,
    archivedAt: new Date().toISOString(),
    autoDeleteAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  };

  const allArchived = await getAllArchived();
  await AsyncStorage.setItem(ARCHIVE_KEY, JSON.stringify([...allArchived, archivedItem]));
  await deleteItem(id);
}

export async function getAllArchived(): Promise<ArchivedItem[]> {
  const json = await AsyncStorage.getItem(ARCHIVE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function restoreItem(id: string): Promise<void> {
  const allArchived = await getAllArchived();
  const target = allArchived.find(i => i.id === id);
  if (!target) return;

  const item: SavedItem = { ...target };
  delete (item as Partial<ArchivedItem>).archivedAt;
  delete (item as Partial<ArchivedItem>).autoDeleteAt;
  await saveItem(item);
  await deleteArchived(id);
}

export async function deleteArchived(id: string): Promise<void> {
  const all = await getAllArchived();
  const next = all.filter(i => i.id !== id);
  await AsyncStorage.setItem(ARCHIVE_KEY, JSON.stringify(next));
}

export async function clearArchive(): Promise<void> {
  await AsyncStorage.removeItem(ARCHIVE_KEY);
}

export async function purgeExpiredArchive(): Promise<void> {
  const all = await getAllArchived();
  const live = all.filter(i => new Date(i.autoDeleteAt).getTime() > Date.now());
  await AsyncStorage.setItem(ARCHIVE_KEY, JSON.stringify(live));
}
