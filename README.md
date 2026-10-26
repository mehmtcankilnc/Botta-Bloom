# Botta Bloom

English | [Türkçe](README.tr.md)

A website I designed and built for **Botta Bloom**, a boutique cafe in Cemalpaşa, Adana: a scroll-animated storefront, a loyalty stamp card with Google sign-in, a coupon system, and an admin panel that needs no technical knowledge.

**Live demo:** https://botta-bloom.web.app

> This is a design proposal prepared for Botta Bloom. The brand name, menu content and imagery belong to the business.

## Idea

The cafe's identity combines three things: coffee, food and flowers. I built the site as three "scenes", one for each. As visitors scroll, flowers bloom out of a coffee cup, a mini burger explodes into its layers, and iced drinks take the stage. At the bottom of the page there is a small garden where visitors can plant their own flowers.

The goal was a site that conveys the cafe's atmosphere and is also genuinely useful: customers browse the menu, see events and collect stamps, while the owner updates everything without help.

## Features

**Visitor side**
- Scroll-driven home page: a cup that blooms, a burger that separates into layers, drinks that take turns in focus
- A hero cup that blinks, follows the cursor and bursts into petals when clicked
- Menu with categories and search
- Events page (upcoming and past)
- Interactive flower garden in the footer: tap an empty spot to plant a flower, and flowers lean toward the pointer
- Footer that works out whether the cafe is open or closed from the opening hours, with one-tap copy for address and phone

**Loyalty system**
- Google sign-in (Firebase Authentication)
- A personal member code, a stamp for each visit, and a reward at the goal
- Campaign-based coupons: members claim a coupon, and the cashier marks it as used with its code
- Google sign-in does not work in Instagram's in-app browser, so the loyalty page shows a warning in that case

**Admin panel**
- Menu: add and edit categories and items, upload photos
- Campaigns, events and site settings (address, hours, phone, links)
- Cashier screen: find a member by code, name or email, add a stamp, give a reward, mark a coupon as used
- Only accounts on the admin list get in; everyone else is redirected to the home page

## Technical choices

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript, Vite |
| Routing | React Router |
| Animation | GSAP + ScrollTrigger, SVG artwork |
| Authentication | Firebase Authentication (Google) |
| Database | Cloud Firestore |
| Image hosting | Cloudinary (unsigned upload, automatic WebP/AVIF) |
| Hosting | Firebase Hosting |

**Why Firebase?** A small business needs something that is always on and fits comfortably in the free quota. I deliberately avoided free tiers that pause a project after a period of inactivity. Firebase Storage requires a paid plan for new projects, so I used Cloudinary for images.

**Keeping reads low.** The menu and site settings live in a single document and are read once per session. A visitor moving between pages does not hit Firestore again.

**Security rules.** Authorization is enforced in Firestore rules (`firestore.rules`), not in the client:
- Public content (menu, events, campaigns) is readable by everyone and writable only by admins
- The admin list can only be edited by hand in the Firebase Console
- Members can read only their own profile and coupons; adding stamps, giving rewards and marking coupons as used are admin-only
- A coupon document ID is derived from the user and the campaign, so each user can claim one coupon per campaign

**Motion and accessibility.** If the operating system has "reduce motion" on, scroll animations are not set up and scenes are shown in their final state. On mobile there is a fixed bottom navigation bar and touch-friendly sizes.

**Performance.** The fonts (Fraunces, Figtree) are self-hosted and preloaded. Instead of flashing unstyled fallback text on first load, the site shows a splash screen in the brand colors.

**SEO.** Each page has its own title, description and canonical URL. The site ships Open Graph and Twitter cards, `CafeOrCoffeeShop` structured data (JSON-LD), a PWA manifest, and a `robots.txt` and `sitemap.xml` generated at build time. The admin and loyalty pages are kept out of search results.

## Demo mode

If `.env` is empty, the site runs with sample data and needs no Firebase connection. This is handy for quickly showing the design.

## Run locally

```bash
npm install
cp .env.example .env    # fill in Firebase and Cloudinary values
npm run dev             # development server
npm run build           # production build (dist/)
```

## Setup

1. **Firebase:** go to console.firebase.google.com, create a project, add a Web app and copy its config values into `.env`.
2. **Sign-in:** Authentication → Sign-in method → enable Google.
3. **Database:** create Firestore and deploy the rules: `npx firebase-tools deploy --only firestore:rules`
4. **First admin:** sign in to the site once with Google. In Authentication → Users, copy the account's **User UID**, then in Firestore add a document to the `admins` collection whose document ID is that UID.
5. **First menu:** Admin → Menu → "Load the Trendyol Go menu" writes the sample menu to Firestore.
6. **Photo upload (optional):** Cloudinary → Settings → Upload → create an **unsigned** upload preset, then put the cloud name and preset name in `.env`.
7. **Deploy:**
   ```bash
   npm run build
   npx firebase-tools deploy --only hosting,firestore:rules
   ```

The site URL is derived from the project ID (`https://<project>.web.app`). If you have your own domain, add `VITE_SITE_URL=https://yourdomain.com` to `.env`; the canonical URL, sitemap and share images will use it.

## Project structure

```
src/
  components/   Layout, Footer, FooterGarden, Photo, form components
  context/      Auth (user, membership, admin status)
  lib/          Firebase, content hooks, Cloudinary, SEO hook, sample data
  pages/        Home, menu, events, loyalty, admin
  scenes/       Scroll-driven scenes (hero, burger, drinks)
public/         Icons, share image, fonts, manifest
firestore.rules Security rules
```

## Known notes

- Menu photos initially come from Trendyol Go; for a lasting setup, upload your own photos from the admin panel.
- Google sign-in does not work in Instagram's in-app browser; the loyalty page shows a warning in that case.
- Phone and address are entered in the admin panel under Site settings.
