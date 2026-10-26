import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { firebaseReady } from '../lib/firebase'

export const inInstagramBrowser = () => /Instagram|FBAN|FBAV/i.test(navigator.userAgent)

export function LoginButton({ compact = false }: { compact?: boolean }) {
  const { user, signIn, signOut } = useAuth()
  const [err, setErr] = useState('')

  if (!firebaseReady) return null

  if (user) {
    return (
      <div className="user-chip">
        {user.photoURL && <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />}
        {!compact && <span>{user.displayName}</span>}
        <button className="btn btn-ghost btn-sm" onClick={signOut}>Çıkış</button>
      </div>
    )
  }

  return (
    <div className="login-wrap">
      <button
        className={compact ? 'btn btn-ghost btn-sm' : 'btn btn-primary'}
        onClick={() => signIn().catch(() => setErr('Giriş yapılamadı, tekrar deneyin.'))}
      >
        Google ile giriş
      </button>
      {err && <small className="error-text">{err}</small>}
    </div>
  )
}
