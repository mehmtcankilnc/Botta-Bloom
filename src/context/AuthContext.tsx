import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { auth, db, firebaseReady } from '../lib/firebase'
import type { Member } from '../lib/types'
import { shortCode } from '../lib/util'

interface AuthState {
  ready: boolean
  user: User | null
  member: Member | null
  isAdmin: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthState>({
  ready: true,
  user: null,
  member: null,
  isAdmin: false,
  signIn: async () => {},
  signOut: async () => {},
})

export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!firebaseReady)
  const [user, setUser] = useState<User | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) {
        setMember(null)
        setIsAdmin(false)
        setReady(true)
      }
    })
  }, [])

  // Giriş yapan üyenin profilini canlı izle (damga sayısı yönetici tarafından değişince anında yansır)
  useEffect(() => {
    if (!db || !user) return
    let off = () => {}
    let cancelled = false
    ;(async () => {
      const ref = doc(db!, 'users', user.uid)
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        await setDoc(ref, {
          name: user.displayName ?? '',
          email: user.email ?? '',
          photoURL: user.photoURL ?? '',
          memberCode: shortCode(6),
          stamps: 0,
          rewardsRedeemed: 0,
          createdAt: Date.now(),
        })
      }
      try {
        const a = await getDoc(doc(db!, 'admins', user.uid))
        if (!cancelled) setIsAdmin(a.exists())
      } catch {
        if (!cancelled) setIsAdmin(false)
      }
      if (cancelled) return
      off = onSnapshot(ref, (s) => {
        if (s.exists()) setMember({ ...(s.data() as Omit<Member, 'uid'>), uid: user.uid })
        setReady(true)
      })
    })().catch(() => setReady(true))
    return () => {
      cancelled = true
      off()
    }
  }, [user])

  const signIn = async () => {
    if (!auth) return
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (e) {
      const code = (e as { code?: string }).code
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
        await signInWithRedirect(auth, provider)
      } else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        throw e
      }
    }
  }

  const signOut = async () => {
    if (auth) await fbSignOut(auth)
  }

  return <Ctx.Provider value={{ ready, user, member, isAdmin, signIn, signOut }}>{children}</Ctx.Provider>
}
