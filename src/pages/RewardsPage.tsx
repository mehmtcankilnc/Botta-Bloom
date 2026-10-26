import { useEffect, useState } from 'react'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { LoginButton, inInstagramBrowser } from '../components/LoginButton'
import { useCampaigns, useSettings } from '../lib/content'
import { db, firebaseReady } from '../lib/firebase'
import type { Campaign, UserCoupon } from '../lib/types'
import { shortCode, todayISO } from '../lib/util'
import { usePageMeta } from '../lib/usePageMeta'

export function RewardsPage() {
  usePageMeta('Sadakat kartı', 'Botta Bloom damga kartın ve kuponların.', { noindex: true })
  const { ready, user, member } = useAuth()
  const { data: s } = useSettings()
  const { data: campaigns } = useCampaigns()
  const [coupons, setCoupons] = useState<UserCoupon[]>([])
  const [busy, setBusy] = useState('')
  const [err, setErr] = useState('')

  const loadCoupons = async () => {
    if (!db || !user) return
    const snap = await getDocs(query(collection(db, 'userCoupons'), where('uid', '==', user.uid)))
    setCoupons(snap.docs.map((d) => ({ ...(d.data() as Omit<UserCoupon, 'id'>), id: d.id })))
  }

  useEffect(() => {
    void loadCoupons().catch(() => setErr('Kuponlar yüklenemedi.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const claim = async (c: Campaign) => {
    if (!db || !user) return
    setBusy(c.id)
    setErr('')
    try {
      await setDoc(doc(db, 'userCoupons', `${user.uid}_${c.id}`), {
        uid: user.uid,
        campaignId: c.id,
        title: c.title,
        discountText: c.discountText,
        code: shortCode(6),
        status: 'active',
        createdAt: Date.now(),
      })
      await loadCoupons()
    } catch {
      setErr('Kupon alınamadı. Bu kampanya sona ermiş ya da daha önce alınmış olabilir.')
    } finally {
      setBusy('')
    }
  }

  const today = todayISO()
  const live = campaigns.filter((c) => c.active && (!c.endsAt || c.endsAt >= today))
  const claimedIds = new Set(coupons.map((c) => c.campaignId))
  const goal = s.stampGoal

  if (!firebaseReady) {
    return (
      <div className="page narrow">
        <h1>Sadakat</h1>
        <p className="muted">Bu bölüm Firebase bağlandığında çalışır (README → Kurulum).</p>
      </div>
    )
  }

  if (!ready) return <div className="page narrow"><p className="muted">Yükleniyor…</p></div>

  if (!user) {
    return (
      <div className="page narrow">
        <h1>Sadakat</h1>
        <p className="lead">
          Her ziyarette damga toplayın. {goal}. damgada: {s.rewardText.toLowerCase()}. Kampanya kuponları da burada.
        </p>
        {inInstagramBrowser() && (
          <p className="notice">
            Instagram içinden açtıysanız Google girişi çalışmayabilir. Sağ üstteki menüden “Tarayıcıda aç” seçin.
          </p>
        )}
        <LoginButton />
      </div>
    )
  }

  const stamps = member?.stamps ?? 0

  return (
    <div className="page narrow">
      <h1>Sadakat</h1>

      <section className="loyalty-card" aria-label="Damga kartı">
        <div className="loyalty-head">
          <div>
            <h2>{user.displayName?.split(' ')[0] ?? 'Merhaba'}</h2>
            <p className="muted">{stamps >= goal ? `${s.rewardText}! Kasada söyleyin.` : `${goal - stamps} damga sonra: ${s.rewardText.toLowerCase()}`}</p>
          </div>
          <div className="member-code">
            <small>Üye kodunuz</small>
            <strong>{member?.memberCode ?? '······'}</strong>
          </div>
        </div>
        <ol className="stamps" aria-label={`${stamps} / ${goal} damga`}>
          {Array.from({ length: goal }).map((_, i) => (
            <li key={i} className={i < stamps ? 'on' : ''}>
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="3" />
                <path d="M16 13C11 6 20 3 16 0c-4 3 5 6 0 13Zm3 3c7-5 10 4 13 0-3-4-6 5-13 0Zm-3 3c5 7-4 10 0 13 4-3-5-6 0-13Zm-3-3C6 21 3 12 0 16c3 4 6-5 13 0Z" transform="translate(0 0) scale(.9) translate(1.6 1.6)" />
              </svg>
              <span className="sr-only">{i < stamps ? 'Dolu' : 'Boş'}</span>
            </li>
          ))}
        </ol>
        <p className="muted small">Kasada üye kodunuzu söyleyin, damganız eklenir.</p>
      </section>

      <section>
        <h2 className="subhead">Kuponlarım</h2>
        {coupons.length === 0 && <p className="muted">Henüz kuponunuz yok. Aşağıdaki kampanyalardan alabilirsiniz.</p>}
        <div className="coupon-list">
          {coupons.map((c) => (
            <article key={c.id} className={`coupon ${c.status === 'used' ? 'used' : ''}`}>
              <div>
                <h3>{c.discountText}</h3>
                <p>{c.title}</p>
              </div>
              <div className="coupon-code">
                {c.status === 'used' ? <span>Kullanıldı</span> : <><small>Kod</small><strong>{c.code}</strong></>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="subhead">Aktif kampanyalar</h2>
        {live.length === 0 && <p className="muted">Şu an aktif kampanya yok.</p>}
        <div className="coupon-list">
          {live.map((c) => (
            <article key={c.id} className="coupon offer">
              <div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <small className="muted">{c.discountText}{c.endsAt && ` · ${c.endsAt} tarihine kadar`}</small>
              </div>
              <button
                className="btn btn-primary btn-sm"
                disabled={claimedIds.has(c.id) || busy === c.id}
                onClick={() => claim(c)}
              >
                {claimedIds.has(c.id) ? 'Alındı' : 'Kuponu al'}
              </button>
            </article>
          ))}
        </div>
        {err && <p className="error-text">{err}</p>}
      </section>
    </div>
  )
}
