export interface Category { id: string; name: string }

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  image: string
  featured: boolean
  available: boolean
}

export interface MenuDoc { categories: Category[]; items: MenuItem[] }

export interface SiteSettings {
  name: string
  tagline: string
  heroTitle: string
  heroText: string
  heroImage: string
  phone: string
  address: string
  hours: string
  instagram: string
  orderUrl: string
  mapUrl: string
  stampGoal: number
  rewardText: string
}

export interface Campaign {
  id: string
  title: string
  description: string
  discountText: string
  active: boolean
  endsAt: string // YYYY-MM-DD, boş olabilir
}

export interface CafeEvent {
  id: string
  title: string
  description: string
  date: string // YYYY-MM-DD
  time: string
  image: string
  active: boolean
}

export interface Member {
  uid: string
  name: string
  email: string
  photoURL: string
  memberCode: string
  stamps: number
  rewardsRedeemed: number
}

export interface UserCoupon {
  id: string
  uid: string
  campaignId: string
  title: string
  discountText: string
  code: string
  status: 'active' | 'used'
}
