import { useCallback, useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { defaultSettings, seedCampaigns, seedEvents, seedMenu } from './seed'
import type { CafeEvent, Campaign, MenuDoc, SiteSettings } from './types'

// Ziyaretçi başına tek okuma: menü ve ayarlar tek belgede tutulur, oturum boyunca bellekte saklanır.
const memo = new Map<string, unknown>()

async function cached<T>(key: string, fn: () => Promise<T>, force = false): Promise<T> {
  if (!force && memo.has(key)) return memo.get(key) as T
  const v = await fn()
  memo.set(key, v)
  return v
}

export const fetchMenu = (force = false) =>
  cached<MenuDoc>('menu', async () => {
    if (!db) return seedMenu
    const snap = await getDoc(doc(db, 'content', 'menu'))
    return snap.exists() ? (snap.data() as MenuDoc) : seedMenu
  }, force)

export const fetchSettings = (force = false) =>
  cached<SiteSettings>('settings', async () => {
    if (!db) return defaultSettings
    const snap = await getDoc(doc(db, 'content', 'site'))
    return snap.exists() ? { ...defaultSettings, ...(snap.data() as Partial<SiteSettings>) } : defaultSettings
  }, force)

export const fetchCampaigns = (force = false) =>
  cached<Campaign[]>('campaigns', async () => {
    if (!db) return seedCampaigns
    const snap = await getDocs(collection(db, 'campaigns'))
    return snap.docs.map((d) => ({ ...(d.data() as Omit<Campaign, 'id'>), id: d.id }))
  }, force)

export const fetchEvents = (force = false) =>
  cached<CafeEvent[]>('events', async () => {
    if (!db) return seedEvents
    const snap = await getDocs(collection(db, 'events'))
    return snap.docs
      .map((d) => ({ ...(d.data() as Omit<CafeEvent, 'id'>), id: d.id }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, force)

export async function saveMenu(menu: MenuDoc) {
  if (!db) throw new Error('Firebase ayarlanmamış')
  await setDoc(doc(db, 'content', 'menu'), menu)
  memo.set('menu', menu)
}

export async function saveSettings(s: SiteSettings) {
  if (!db) throw new Error('Firebase ayarlanmamış')
  await setDoc(doc(db, 'content', 'site'), s)
  memo.set('settings', s)
}

export async function saveCampaign(c: Campaign) {
  if (!db) throw new Error('Firebase ayarlanmamış')
  const { id, ...data } = c
  await setDoc(doc(db, 'campaigns', id), data)
  memo.delete('campaigns')
}

export async function removeCampaign(id: string) {
  if (!db) throw new Error('Firebase ayarlanmamış')
  await deleteDoc(doc(db, 'campaigns', id))
  memo.delete('campaigns')
}

export async function saveEvent(e: CafeEvent) {
  if (!db) throw new Error('Firebase ayarlanmamış')
  const { id, ...data } = e
  await setDoc(doc(db, 'events', id), data)
  memo.delete('events')
}

export async function removeEvent(id: string) {
  if (!db) throw new Error('Firebase ayarlanmamış')
  await deleteDoc(doc(db, 'events', id))
  memo.delete('events')
}

export function useLoad<T>(fn: (force?: boolean) => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(
    async (force = false) => {
      setLoading(true)
      try {
        setData(await fn(force))
        setError('')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Yüklenemedi')
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    void load()
  }, [load])

  return { data, loading, error, reload: () => load(true), setData }
}

export const useMenu = () => useLoad(fetchMenu, { categories: [], items: [] } as MenuDoc)
export const useSettings = () => useLoad(fetchSettings, defaultSettings)
export const useCampaigns = () => useLoad(fetchCampaigns, [] as Campaign[])
export const useEvents = () => useLoad(fetchEvents, [] as CafeEvent[])
