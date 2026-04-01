# TrackUp — MVP Development Plan

> **Decision:** Tracks = Power / Embedded / Communications / Career Shift (Electrical Engineering focus)
> **Stack:** HTML + TailwindCSS + Vanilla JS (modular, component-based)
> **Goal:** User enters → takes test → sees result → enters track → has full picture

---

## Current State Audit

### Architecture (Solid — keep as-is)
- [x] Modular screen structure `src/screens/`
- [x] Services separated from UI `src/services/`
- [x] Mock data ready for API swap `src/data/mock/`
- [x] State management `src/state.js`
- [x] Hash-based router `src/router.js`
- [x] i18n (EN/AR + RTL) `src/i18n.js`
- [x] Dark/Light mode via `data-theme`
- [x] LocalStorage persistence via `StorageService`

### Known Bugs / Technical Debt
- [ ] `src/data.js` (root) conflicts with `src/data/mock/` — remove or document role
- [ ] `testQuestions.js` duplicates `questions.js` — consolidate into one source of truth
- [ ] No dynamic route `/career/:id` — Career screen enrolls directly without showing Track Details
- [ ] Landing CTA goes to `/register` instead of `/test` — breaks the GPS flow
- [ ] Onboarding screen sits in the main flow unconditionally — evaluate if it adds friction

---

## Phase 0 — Data Identity Reset
> Priority: CRITICAL | Estimated: 1 day

Wipe and replace all software-track data with Electrical Engineering tracks.

### Tasks

- [ ] **`src/data/mock/tracks.js`** — Replace all 5 existing tracks with:

  | id | name | nameAr | icon | color |
  |---|---|---|---|---|
  | `power` | Power Systems Engineer | مهندس أنظمة القوى | PW | `#f59e0b` |
  | `embedded` | Embedded Systems Engineer | مهندس الأنظمة المدمجة | EM | `#6366f1` |
  | `communications` | Communications Engineer | مهندس الاتصالات | CM | `#10b981` |
  | `career-shift` | Career Shift to Engineering | تحويل مسار للهندسة | CS | `#ec4899` |

  Each track must include:
  - `description` + `descriptionAr`
  - `workStyle`: `field` | `office` | `hybrid`
  - `skills[]` (6 items)
  - `pros[]` (3 items)
  - `cons[]` (3 items)
  - `salaryRange` (EGP + USD rough range)
  - `futureOutlook` + `futureOutlookAr`
  - `rolesAfter[]`
  - `demandLevel`: `High` | `Very High`
  - `duration` + `durationAr`
  - `fitTraits[]`

- [ ] **`src/data/mock/questions.js`** — Rewrite all 7 questions to cover Hardware vs Software decision axis. Examples aligned with vision:

  | # | Question | Axis |
  |---|---|---|
  | 1 | تفضل شغل عملي (Hardware/Site) أو برمجي أو مزيج؟ | Work type |
  | 2 | بتحب البرمجة؟ (جداً / شوية / لأ) | Software affinity |
  | 3 | تفضل بيئة الشغل: ميداني / مكتبي / Hybrid | Environment |
  | 4 | هدفك الأساسي: فلوس / استقرار / سفر | Goal |
  | 5 | تقدر تستحمل ضغط شغل عالي؟ | Stress tolerance |
  | 6 | تفضل تشتغل: منفرد / فريق صغير / فريق كبير | Collaboration |
  | 7 | أكتر حاجة بتبسطك: أبني حاجة / أحلل مشكلة / أتواصل مع الناس | Core drive |

  Each option must carry `weights` for: `power`, `embedded`, `communications`, `career-shift`

- [ ] **`src/services/test.service.js`** — Update scoring engine: replace old track IDs with new ones, verify `percentages` calculation still works
- [ ] **`src/data/mock/roadmaps.js`** — Add roadmap data for 4 new tracks (Step 1→4 structure)
- [ ] **`src/data/mock/courses.js`** — Add courses per new track (3–4 courses each, free/paid flag)
- [ ] **`src/data/mock/mentors.js`** — Update mentor `trackId` references to match new IDs
- [ ] **Remove `src/data.js`** (root-level) — confirm unused, then delete
- [ ] **Remove `src/data/mock/testQuestions.js`** — consolidate into `questions.js`

---

## Phase 1 — Landing UX Fix
> Priority: CRITICAL | Estimated: 1 day

The Landing page must feel like a GPS entry point, not a marketing page.

### Tasks

- [ ] **`src/screens/Landing/Landing.js`** — Change primary CTA:
  ```js
  // BEFORE
  href="#/register"
  // AFTER
  href="#/test"
  ```
  Label changes to: `"ابدأ الاختبار"` / `"Take the Test — Free"`

- [ ] **Add Track Preview Section** to Landing (before the Steps section):
  - 4 cards: Power / Embedded / Communications / Career Shift
  - Each card: icon + name + one-line description
  - Clicking a card goes to `/career/${id}` (read-only preview, not enroll)
  - Style: light grid, not heavy — just enough to orient the user

- [ ] **Simplify Hero copy** — reduce subtitle length, make the single message clear:
  > "مش عارف تختار تخصص؟ خد الاختبار في 3 دقايق."

- [ ] **Evaluate Onboarding screen** — if it adds a step before the test, make it skippable or remove from default flow. The guard in `app.js` should not force `/onboarding` before `/test`.

- [ ] **`src/i18n.js`** — Add translation keys for new landing copy and track names

---

## Phase 2 — TrackDetails Screen (New)
> Priority: HIGH | Estimated: 2 days

Currently, Career screen enrolls directly without showing full track context. This breaks the core vision.

### Tasks

- [ ] **Create `src/screens/TrackDetails/TrackDetails.js`**

  Layout sections (in order):
  1. Track Header — icon, name, demand badge, salary range
  2. What does this field do? — 2–3 sentence description
  3. Work Nature — field / office / hybrid indicator
  4. Required Skills — chip list
  5. Pros (3) — green check list
  6. Cons (3) — red x list
  7. Salary Range — EGP + rough USD equivalent
  8. Future of the Field — 2 sentences
  9. Intro Videos — 3 placeholder cards (YouTube embed or thumbnail)
  10. CTA — `"ابدأ هذا المسار"` → enrolls + navigates to `/roadmap`

- [ ] **Create `src/screens/TrackDetails/TrackDetails.css`** (or add to existing styles)

- [ ] **`src/router.js`** — Add dynamic route support:
  ```js
  Router.register('/career/:id', { render: TrackDetails, after: TrackDetailsEvents });
  ```
  Or pass `id` via query param: `/career?id=power` if dynamic segments aren't supported

- [ ] **`src/screens/Career/Career.js`** — Change card button behavior:
  ```js
  // BEFORE: enrolls immediately → /roadmap
  // AFTER: navigates to /career/:id for details first
  ```
  Active track card still shows "View Roadmap" → `/roadmap`

- [ ] **`src/app.js`** — Import and register `TrackDetails` screen

---

## Phase 3 — Results Screen Audit
> Priority: HIGH | Estimated: 1 day

Results is the WOW moment. It must feel fast, clear, and decisive.

### Tasks

- [ ] **`src/screens/Results/Results.js`** — Audit and verify:
  - [ ] Top 3 tracks shown with animated percentage bars (stagger-in animation)
  - [ ] #1 track is visually dominant (larger card, accent color)
  - [ ] Confidence level indicator (`High / Medium / Low`) visible
  - [ ] Primary CTA: `"ادخل على مسارك الأول"` → navigates to `/career/${topTrackId}`
  - [ ] Secondary: `"شوف التفاصيل الكاملة"` → `/decision-summary`

- [ ] **Clarify `/results` vs `/decision-summary` separation:**
  - `/results` = fast, visual, action-oriented (3–5 seconds to understand)
  - `/decision-summary` = deep dive, cognitive map, shareable profile

- [ ] **Update demo result** in `Landing.js` `_activateDemo()` to use new track IDs (`power`, `embedded`, `communications`)

---

## Phase 4 — Roadmap Screen Audit
> Priority: MEDIUM | Estimated: 1 day

### Tasks

- [ ] **`src/screens/Roadmap/Roadmap.js`** — Verify:
  - [ ] Steps are clearly ordered: Step 1 (Basics) → Step 2 (Courses) → Step 3 (Projects) → Step 4 (Job Ready)
  - [ ] Active step is visually highlighted
  - [ ] Each step has a short description and a next action button
  - [ ] Roadmap is filtered by `user.activeTrackId` — no generic roadmap

- [ ] **`src/data/mock/roadmaps.js`** — Add entries for `power`, `embedded`, `communications`, `career-shift` tracks

---

## Phase 5 — Courses Screen Audit
> Priority: MEDIUM | Estimated: 0.5 day

### Tasks

- [ ] **`src/screens/Courses/Courses.js`** — Verify:
  - [ ] Courses filtered by active track
  - [ ] Each course: name, free/paid badge, provider, "ابدأ" button (external link or placeholder)
  - [ ] Visual distinction between free and paid courses

- [ ] **`src/data/mock/courses.js`** — Add 3–4 courses per new track

---

## Phase 6 — Flow Polish + Bonus Tier 1
> Priority: MEDIUM | Estimated: 2 days

### Tasks

- [ ] **Journey Progress Indicator** — Add a subtle top-bar component showing current step:
  ```
  [Test] → [Results] → [Track] → [Roadmap]
  ```
  Visible on: `/test`, `/results`, `/decision-summary`, `/career`, `/roadmap`
  Hidden on: Landing, Auth, Dashboard

- [ ] **Re-take Test button** — Add to Dashboard and Results screen
  - Clears `testResult` from state + storage
  - Navigates to `/test`
  - SweetAlert2 confirm dialog before clearing

- [ ] **Save Results without Registration** — If user has `testResult` but no `user`:
  - Show a sticky banner: `"احفظ نتيجتك — سجّل مجاناً"`
  - Banner visible on `/results` and `/decision-summary`
  - Dismiss stores `dismissed_save_banner` in LocalStorage

- [ ] **Dark mode QA** — Test all new screens in dark mode
- [ ] **RTL layout QA** — Test all new screens in Arabic/RTL
- [ ] **Keyboard navigation** — Ensure Test screen options are keyboard-accessible (Enter/Space)

---

## Bonus Tier 2 — Post-MVP (Do Not Start Until Tier 1 Complete)

- [ ] Share Result Card — generate a shareable image (CSS-based) for LinkedIn/Twitter
- [ ] Mentor Match by Track — filter Mentorship screen by `user.activeTrackId`
- [ ] Track Progress Gamification — milestone badges (Started / 25% / Halfway / Job Ready)
- [ ] Weekly Checkin Modal — periodic prompt: "أنت في Step 2، اتقدمت؟"
- [ ] Track Comparison in Results — side-by-side Top 3 detailed grid

---

## File Change Index

| File | Action | Phase |
|---|---|---|
| `src/data/mock/tracks.js` | Rewrite | 0 |
| `src/data/mock/questions.js` | Rewrite | 0 |
| `src/data/mock/testQuestions.js` | Delete | 0 |
| `src/data/mock/roadmaps.js` | Update | 0 + 4 |
| `src/data/mock/courses.js` | Update | 0 + 5 |
| `src/data/mock/mentors.js` | Update | 0 |
| `src/data.js` | Delete | 0 |
| `src/services/test.service.js` | Update scoring | 0 |
| `src/screens/Landing/Landing.js` | Update CTA + add Track Preview | 1 |
| `src/i18n.js` | Add new keys | 1 + 2 |
| `src/screens/TrackDetails/TrackDetails.js` | Create | 2 |
| `src/screens/Career/Career.js` | Update card navigation | 2 |
| `src/router.js` | Add `/career/:id` or query-param route | 2 |
| `src/app.js` | Register TrackDetails | 2 |
| `src/screens/Results/Results.js` | Audit + fix | 3 |
| `src/screens/Roadmap/Roadmap.js` | Audit + fix | 4 |
| `src/screens/Courses/Courses.js` | Audit + fix | 5 |
| `src/components/layout/Topbar.js` | Add Journey Progress Indicator | 6 |

---

## Definition of MVP Done

The MVP is complete when a user can:

1. Land on the homepage and immediately understand the 4 tracks
2. Press one button and start the test (no registration wall)
3. Finish 7 questions and see Top 3 tracks with percentages
4. Click their top track and read a full details page
5. Press "ابدأ هذا المسار" and see a structured 4-step roadmap
6. See relevant courses for their track
7. All of the above works in Arabic + RTL and Dark Mode

---

*Last updated: 2026-04-01 | Author: TrackUp Engineering*
