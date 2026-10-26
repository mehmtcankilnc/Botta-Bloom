import { useState, type FormEvent } from 'react'
import { collection, doc, getDoc, getDocs, increment, limit, query, updateDoc, where } from 'firebase/firestore'
import { useSettings } from '../../lib/content'
import { db } from '../../lib/firebase'
import type { Campaign, Member, UserCoupon } from '../../lib/types'

type FoundCoupon = UserCoupon & { campaign: Campaign | null; ownerName: string }

export function MembersAdmin() {
  const { data: s } = useSettings()
  const [q, setQ] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [searched, setSearched] = useState(false)
  const [code, setCode] = useState('')
  const [coupon, setCoupon] = useState<FoundCoupon | null>(null)
  const [couponMsg, setCouponMsg] = useState('')
  const [msg, setMsg] = useState('')

  const toMember = (d: { id: string; data: () => unknown }) => ({ ...(d.data() as Omit<Member, 'uid'>), uid: d.id }) as Member

  const search = async (e: FormEvent) => {
    e.preventDefault()
    if (!db) return
    setMsg('')
    const term = q.trim()
    try {
      let found: Member[]
      if (/^[A-Za-z0-9]{6}$/.test(term)) {
        const snap = await getDocs(query(collection(db, 'users'), where('memberCode', '==', term.toUpperCase()), limit(1)))
        found = snap.docs.map(toMember)
      } else {
        const snap = await getDocs(query(collection(db, 'users'), limit(300)))
        const needle = term.toLocaleLowerCase('tr')
        found = snap.docs.map(toMember).filter((m) => !needle || `${m.name} ${m.email}`.toLocaleLowerCase('tr').includes(needle))
      }
      setMembers(found.slice(0, 20))
      setSearched(true)
    } catch {
      setMsg('Arama yapılamadı. Yönetici yetkinizi kontrol edin.')
    }
  }

  const patch = (uid: string, p: Partial<Member>) => setMembers((ms) => ms.map((m) => (m.uid === uid ? { ...m, ...p } : m)))

  const addStamp = async (m: Member, by: 1 | -1) => {
    if (!db || m.stamps + by < 0) return
    try {
      await updateDoc(doc(db, 'users', m.uid), { stamps: increment(by) })
      patch(m.uid, { stamps: m.stamps + by })
    } catch {
      setMsg('Damga eklenemedi.')
    }
  }

  const redeemReward = async (m: Member) => {
    if (!db || m.stamps < s.stampGoal) return
    try {
      await updateDoc(doc(db, 'users', m.uid), { stamps: increment(-s.stampGoal), rewardsRedeemed: increment(1) })
      patch(m.uid, { stamps: m.stamps - s.stampGoal, rewardsRedeemed: m.rewardsRedeemed + 1 })
    } catch {
      setMsg('Ödül işlenemedi.')
    }
  }

  const findCoupon = async (e: FormEvent) => {
    e.preventDefault()
    if (!db) return
    setCoupon(null)
    setCouponMsg('')
    try {
      const snap = await getDocs(query(collection(db, 'userCoupons'), where('code', '==', code.trim().toUpperCase()), limit(1)))
      if (snap.empty) return setCouponMsg('Bu kodla kupon bulunamadı.')
      const d = snap.docs[0]
      const c = { ...(d.data() as Omit<UserCoupon, 'id'>), id: d.id }
      // Başlık ve indirim metni, üyenin belgesinden değil kampanyanın kendisinden okunur.
      const [camp, owner] = await Promise.all([getDoc(doc(db, 'campaigns', c.campaignId)), getDoc(doc(db, 'users', c.uid))])
      setCoupon({
        ...c,
        campaign: camp.exists() ? ({ ...(camp.data() as Omit<Campaign, 'id'>), id: camp.id }) : null,
        ownerName: owner.exists() ? (owner.data() as Member).name : '',
      })
    } catch {
      setCouponMsg('Kupon aranamadı.')
    }
  }

  const markUsed = async () => {
    if (!db || !coupon) return
    try {
      await updateDoc(doc(db, 'userCoupons', coupon.id), { status: 'used', usedAt: Date.now() })
      setCoupon({ ...coupon, status: 'used' })
      setCouponMsg('Kupon kullanıldı olarak işaretlendi.')
    } catch {
      setCouponMsg('İşaretlenemedi.')
    }
  }

  return (
    <div className="admin-two">
      <section>
        <h2>Damga ekle</h2>
        <form className="inline-form" onSubmit={search}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Üye kodu, ad veya e-posta" aria-label="Üye ara" />
          <button className="btn btn-primary" type="submit">Ara</button>
        </form>
        {msg && <p role="status" className="error-text">{msg}</p>}
        {searched && members.length === 0 && <p className="muted">Üye bulunamadı.</p>}
        <div className="admin-list">
          {members.map((m) => (
            <article key={m.uid} className="admin-row column">
              <div className="admin-row-top">
                <div>
                  <h3>{m.name || m.email} <span className="tag">{m.memberCode}</span></h3>
                  <p className="muted">{m.email} · Kullanılan ödül: {m.rewardsRedeemed}</p>
                </div>
                <strong className="stamp-count">{m.stamps} / {s.stampGoal}</strong>
              </div>
              <div className="row-actions">
                <button className="btn btn-primary btn-sm" onClick={() => addStamp(m, 1)}>+1 damga</button>
                <button className="btn btn-ghost btn-sm" disabled={m.stamps === 0} onClick={() => addStamp(m, -1)}>−1</button>
                <button className="btn btn-ghost btn-sm" disabled={m.stamps < s.stampGoal} onClick={() => redeemReward(m)}>
                  Ödülü kullandır
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Kupon kullandır</h2>
        <form className="inline-form" onSubmit={findCoupon}>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6 haneli kupon kodu" aria-label="Kupon kodu" maxLength={6} />
          <button className="btn btn-primary" type="submit">Kontrol et</button>
        </form>
        {couponMsg && <p role="status" className="muted">{couponMsg}</p>}
        {coupon && (
          <article className="admin-row column">
            <h3>{coupon.campaign?.discountText ?? 'Kampanya silinmiş'}</h3>
            <p>{coupon.campaign?.title}</p>
            <p className="muted">Üye: {coupon.ownerName || '—'}</p>
            {coupon.campaign && !coupon.campaign.active && <p className="error-text">Bu kampanya artık aktif değil.</p>}
            {coupon.status === 'used' ? (
              <p className="tag">Daha önce kullanılmış</p>
            ) : (
              <button className="btn btn-primary" disabled={!coupon.campaign} onClick={markUsed}>Kullanıldı işaretle</button>
            )}
          </article>
        )}
      </section>
    </div>
  )
}
