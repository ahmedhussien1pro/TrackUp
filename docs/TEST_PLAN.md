# TrackUp MVP — Test Plan (Final)

> **قواعد التنفيذ (إلزامية)**
>
> 1. نفّذ كل TC بشكل **مستقل** — واحد بواحد
> 2. بعد كل TC ارجع وسجّل كل نتيجة قبل ما تكمل للتالي
> 3. Error أو سلوك غلط → سجّله في **الملاحظات** بالتفصيل
> 4. بعد التعديل والتأكيد → ضع **`[DONE]`** وغيّر ⬜ إلى ✅
> 5. ❌ ممنوع تخطي خطوة
> 6. ❌ ممنوع تطبيق أكتر من TC واحد في نفس الوقت
> 7. ❌ ممنوع افتراض إن خطوة شغالة من غير تجربة فعلية

---

## خريطة الموقع (Router الفعلي)

### NO_LAYOUT_SCREENS (Hash-based — لا Sidebar ولا Topbar)
```
/ | /login | /register | /pricing | /onboarding
/test | /career | /results | /decision-summary
```

### SEMI_PUBLIC (Guest مسموح بشرط وجود testResult في State)
```
/results | /decision-summary
```
> تنبيه مهم: localStorage وحده لا يكفي — الـ testResult لازم يكون في State (جلسة حالية).
> Refresh على /results لا يشتغل لأن State بيتجدد — بيرجعك لـ /test

### Protected Screens (يحتاج login)
```
كل screen مش في NO_LAYOUT_SCREENS:
/dashboard | /roadmap | /courses | /mentorship
/progress | /notifications | /settings | /payment
```

### Guard Rules الفعلية (app.js)
```
1. logged-in + /login أو /register → /dashboard
2. !isPublic + !loggedIn → /login
3. SEMI_PUBLIC + !hasResult (State) → /test
4. unknown route → /
```

---

## Legend

| رمز | المعنى |
|-----|--------|
| ⬜ | لم يُجرَّب بعد |
| ✅ | نجح |
| ❌ | فشل — مسجّل في الملاحظات |
| 🔧 | تم التعديل — ينتظر إعادة الاختبار |
| [DONE] | تم التأكيد بعد التعديل |

---

## TC-01 — Landing Page

**الأهمية:** HIGH  
**Pre-condition:** امسح localStorage بالكامل (DevTools → Application → Clear All)  

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 1.1 | افتح الموقع | Landing تظهر — لا redirect | ⬜ |
| 1.2 | تأكد وجود زرار CTA فوق الـ fold | "ابدأ الاختبار" أو "Take the Test" مرئي بدون scroll | ⬜ |
| 1.3 | تأكد وجود 4 Track cards | Power, Embedded, Communications, Career Shift — بشكل خفيف | ⬜ |
| 1.4 | اضغط "Take the Test" / "ابدأ الاختبار" | يفتح `#/test` بدون login prompt | ⬜ |
| 1.5 | تأكد Nav: Plans + Sign In + Get Started | الثلاثة موجودة | ⬜ |
| 1.6 | اضغط "Plans" | `#/pricing` | ⬜ |
| 1.7 | في `/pricing` بدون login | public nav ظاهر: Logo + Home + Sign In + Get Started | ⬜ |
| 1.8 | اضغط Home في Pricing nav | `#/` | ⬜ |
| 1.9 | اضغط "تعرف أكثر" على أي Track card | `#/career?id=[trackId]` | ⬜ |
| 1.10 | اضغط "Get Started" في Nav | `#/register` | ⬜ |
| 1.11 | اضغط "جرب بدون تسجيل" / "Try Without Signing Up" | Toast + `#/dashboard` (demo mode) | ⬜ |

**ملاحظات:**
```

```

---

## TC-02 — Career Test — Guest Flow

**الأهمية:** CRITICAL  
**Pre-condition:** localStorage فارغ، لا session

> **تنبيه:** الـ /test في NO_LAYOUT_SCREENS — لا guard يمنع guest من الدخول

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 2.1 | افتح `#/test` مباشرة | Test يظهر — لا redirect | ⬜ |
| 2.2 | السؤال الأول | Text إنجليزي + 4 buttons بحرف A/B/C/D | ⬜ |
| 2.3 | Progress bar في الأعلى | ~14% (1/7) | ⬜ |
| 2.4 | Context label موجود | "Building your creativity profile" | ⬜ |
| 2.5 | Progress dots موجودة | 7 dots — الأول active | ⬜ |
| 2.6 | Exit button موجود | `<a href="#/">` في test-header أعلى يمين | ⬜ |
| 2.7 | اختار خيار من سؤال 1 | بعد 280ms: سؤال 2 يظهر بـ slide animation | ⬜ |
| 2.8 | Progress bar + context + dots تتحدّث | 2/7 — context label يتغيّر | ⬜ |
| 2.9 | اكمل إجابة سؤال 6 | كل سؤال يظهر بنفس الـ pattern | ⬜ |
| 2.10 | اختر إجابة سؤال 7 | Loading screen: 3 dots + "Building your career decision..." | ⬜ |
| 2.11 | بعد ~1600ms | Navigate لـ `#/results` | ⬜ |

**ملاحظات:**
```

```

---

## TC-03 — Result Screen — WOW Moment

**الأهمية:** CRITICAL  
**Pre-condition:** TC-02 مكتمل + testResult موجود في **State** (ليس localStorage فقط)

> **تنبيه:** Refresh على /results بيرجع لـ /test لأن State بيتجدد و testResult بيتمسح من State

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 3.1 | Navigate لـ `#/results` بعد TC-02 | صفحة النتائج تظهر | ⬜ |
| 3.2 | Loading overlay يظهر أولاً | 3 phases: Analysing → Measuring fit → Ranking results | ⬜ |
| 3.3 | بعد ~1400ms | overlay يختفي → Decision Moment card بـ fade | ⬜ |
| 3.4 | في Decision Moment | Icon التراك + "We recommend: [Track]" | ⬜ |
| 3.5 | Score count-up | 0% → قيمة حقيقية خلال ~900ms | ⬜ |
| 3.6 | اضغط "See Full Analysis" | Decision card يختفي → Full Results تظهر | ⬜ |
| 3.7 | في Full Results | Top Track card كبير + نسبة توافق + Confidence badge | ⬜ |
| 3.8 | "Why this track?" | 3 dimensions + progress bars تتملى | ⬜ |
| 3.9 | Runner-up tracks 2 و 3 | تظهر بتأخير stagger | ⬜ |
| 3.10 | CTA الثلاثة موجودة | "Explore [Track]" + "View Full Plan" + "Retake" | ⬜ |
| 3.11 | اضغط "Explore [Track]" | `#/career?id=[topTrackId]` | ⬜ |
| 3.12 | اضغط "View Full Plan" | Enroll ثم `#/decision-summary` | ⬜ |
| 3.13 | اضغط "Retake" | SweetAlert2 confirm → testResult يمسح → `#/test` | ⬜ |
| 3.14 | Save banner (guest) | يظهر للـ guest فقط + dismiss يعمل | ⬜ |
| 3.15 | افتح `#/results` بدون عمل تست قبلها | Redirect لـ `#/test` (guard: !hasResult في State) | ⬜ |
| 3.16 | Refresh في `#/results` | Redirect لـ `#/test` (لأن State بيتجدد) | ⬜ |

**ملاحظات:**
```

```

---

## TC-04 — Track Details Page

**الأهمية:** CRITICAL  
**Pre-condition:** لا يوجد شرط — `/career` في NO_LAYOUT_SCREENS

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 4.1 | `#/career?id=embedded` | Embedded Systems تفتح | ⬜ |
| 4.2 | وصف المجال | نص وصفي واضح | ⬜ |
| 4.3 | طبيعة الشغل | Lab/Field/Office مبيّن | ⬜ |
| 4.4 | المهارات المطلوبة | قائمة موجودة | ⬜ |
| 4.5 | Pros / Cons | 3+ نقاط لكل | ⬜ |
| 4.6 | المرتبات | Range ظاهر | ⬜ |
| 4.7 | مستقبل المجال | Growth outlook section | ⬜ |
| 4.8 | Back button | يرجع لـ `/career` أو browser back | ⬜ |
| 4.9 | `#/career?id=power` | Power Systems بنفس الـ structure | ⬜ |
| 4.10 | `#/career?id=communications` | Communications تفتح | ⬜ |
| 4.11 | `#/career?id=career-shift` | Career Shift تفتح | ⬜ |
| 4.12 | `#/career` بدون id | قائمة كل التراكات | ⬜ |
| 4.13 | `#/career?id=xyz` (id وهمي) | صفحة خطأ أو empty state — مش crash | ⬜ |
| 4.14 | لا Sidebar على /career (حتى logged-in) | موجود في NO_LAYOUT_SCREENS | ⬜ |

**ملاحظات:**
```

```

---

## TC-05 — Register Flow بعد النتيجة

**الأهمية:** HIGH  
**Pre-condition:** TC-02 + TC-03 مكتملين

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 5.1 | من Results اضغط "View Full Plan" | `#/decision-summary` | ⬜ |
| 5.2 | Decision Summary تظهر | Track + strength sentence + stats + social proof | ⬜ |
| 5.3 | زرار "Start My Path" | واضح كـ primary CTA | ⬜ |
| 5.4 | اضغط "Start My Path" (guest) | Toast + `committed_track_id` يتحفظ + `path_committed=true` | ⬜ |
| 5.5 | بعد 600ms | `#/register` | ⬜ |
| 5.6 | Register: name + email + password → submit | `#/dashboard` (لأن `committed_track_id` موجود) | ⬜ |
| 5.7 | Dashboard بعد Register | Track محدد + نتيجة تست موجودة | ⬜ |
| 5.8 | افتح `#/register` مباشرة (بدون committed) | بعد submit → `#/onboarding` | ⬜ |
| 5.9 | Logo في Register | `#/` | ⬜ |
| 5.10 | Email مستخدم من قبل | Error: حساب موجود | ⬜ |
| 5.11 | حقول فاضية + submit | Validation error يظهر | ⬜ |

**ملاحظات:**
```

```

---

## TC-06 — Login Flow — Smart Redirect

**الأهمية:** HIGH  
**Pre-condition:** localStorage فارغ لكل sub-case

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 6.1 | Login: `demo@trackup.io / demo1234` | `#/dashboard` | ⬜ |
| 6.2 | Login: حساب جديد بلا track ولا result | `#/onboarding` | ⬜ |
| 6.3 | عمل Test كـ guest → افتح `#/login` → login | `#/results` (result لسه في State) | ⬜ |
| 6.4 | Logo في Login | `#/` | ⬜ |
| 6.5 | logged-in + افتح `#/login` | Guard: redirect لـ `/dashboard` تلقائياً | ⬜ |
| 6.6 | بيانات خاطئة | Error message — لا navigate | ⬜ |
| 6.7 | حقول فاضية + submit | Validation error | ⬜ |

**ملاحظات:**
```

```

---

## TC-07 — Demo Button

**الأهمية:** MEDIUM  
**Pre-condition:** localStorage فارغ

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 7.1 | اضغط "Try Without Signing Up" | Toast "Loading demo..." | ⬜ |
| 7.2 | بعد ~400ms | `#/dashboard` | ⬜ |
| 7.3 | Dashboard | Track = Embedded Systems، enrolled courses موجودة | ⬜ |
| 7.4 | Refresh | User demo لسه في session — Dashboard يظهر | ⬜ |
| 7.5 | Logout ثم Demo تاني مرة | بيانات قديمة اتمسحت — Demo fresh | ⬜ |
| 7.6 | Demo من Final CTA section | نفس 7.1–7.3 | ⬜ |

**ملاحظات:**
```

```

---

## TC-08 — Back Navigation

**الأهمية:** HIGH  
**Pre-condition:** لا session

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 8.1 | في /test | Exit button موجود `<a href="#/">` | ⬜ |
| 8.2 | اضغط Exit | `#/` | ⬜ |
| 8.3 | في /onboarding step 0 | Home button موجود | ⬜ |
| 8.4 | اضغط Home (Onboarding) | `#/` | ⬜ |
| 8.5 | في /onboarding step 2 | Back button يرجع لـ step 1 | ⬜ |
| 8.6 | Logo في /login | `<a>` link — مش `<span>` | ⬜ |
| 8.7 | Logo في /register | `<a>` link | ⬜ |
| 8.8 | Home في /pricing nav | `#/` | ⬜ |
| 8.9 | Back في /decision-summary | `#/results` (ds-back-results) | ⬜ |

**ملاحظات:**
```

```

---

## TC-09 — Layout Guard

**الأهمية:** HIGH  
**Pre-condition:** لا session للـ cases 9.1–9.4

> **مرجع:** `_needsAppLayout` = `loggedIn && !NO_LAYOUT_SCREENS.includes(path)`

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 9.1 | `#/` بدون login | لا Sidebar، لا Topbar | ⬜ |
| 9.2 | `#/test` بدون login | لا Sidebar، لا Topbar | ⬜ |
| 9.3 | `#/results` بعد تست (guest) | لا Sidebar، لا Topbar | ⬜ |
| 9.4 | `#/pricing` بدون login | لا Sidebar — public nav فقط | ⬜ |
| 9.5 | Login → `#/dashboard` | Sidebar + Topbar ظاهرين | ⬜ |
| 9.6 | logged-in + `#/results` | لا Sidebar (results في NO_LAYOUT_SCREENS) | ⬜ |
| 9.7 | logged-in + `#/test` | لا Sidebar (test في NO_LAYOUT_SCREENS) | ⬜ |
| 9.8 | logged-in + `#/career?id=X` | لا Sidebar (career في NO_LAYOUT_SCREENS) | ⬜ |
| 9.9 | logged-in: navigate بين /dashboard و /settings | Active link في Sidebar يتغيّر | ⬜ |
| 9.10 | logged-in + افتح route مجهول (`#/xyz`) | Guard: redirect لـ `#/` | ⬜ |

**ملاحظات:**
```

```

---

## TC-10 — Language Switch (EN ↔ AR)

**الأهمية:** MEDIUM  
**Pre-condition:** لا session

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 10.1 | Landing: غيّر اللغة لـ AR | كل النصوص عربي + `dir=rtl` على `<html>` | ⬜ |
| 10.2 | اضغط "ابدأ الاختبار" | Test يفتح بالعربي | ⬜ |
| 10.3 | أسئلة التست بالعربي | `textAr` + `labelAr` يظهران | ⬜ |
| 10.4 | النتائج بالعربي | Track اسم + dimensions عربي | ⬜ |
| 10.5 | Refresh | `localStorage trackup__lang` حافظ AR | ⬜ |
| 10.6 | رجّع EN | نصوص إنجليزي + `dir=ltr` | ⬜ |

**ملاحظات:**
```

```

---

## TC-11 — Dark Mode

**الأهمية:** MEDIUM

> **مرجع:** `bootstrap()` يقرأ `StorageService.get('theme')` أو system preference

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 11.1 | Toggle Dark Mode | `data-theme="dark"` على `<html>` + كل screens تتحول | ⬜ |
| 11.2 | Refresh | dark لسه من localStorage — مش رجع light | ⬜ |
| 11.3 | Toggle Light | كل screens ترجع light | ⬜ |
| 11.4 | دخول أول مرة (clear localStorage) | يتبع system preference (prefers-color-scheme) | ⬜ |

**ملاحظات:**
```

```

---

## TC-12 — Dashboard

**الأهمية:** MEDIUM  
**Pre-condition:** Demo login مكتمل

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 12.1 | Dashboard | اسم المستخدم في Topbar | ⬜ |
| 12.2 | Active Track | Embedded Systems ظاهر | ⬜ |
| 12.3 | Progress | نسبة إنجاز ظاهرة | ⬜ |
| 12.4 | Sidebar links | Dashboard, Career, Roadmap, Courses, Mentorship, Progress, Settings | ⬜ |
| 12.5 | Roadmap link | `#/roadmap` | ⬜ |
| 12.6 | Courses link | `#/courses` | ⬜ |
| 12.7 | Mentorship link | `#/mentorship` | ⬜ |
| 12.8 | Logout | session تمسح → `#/` | ⬜ |
| 12.9 | `#/dashboard` بدون login | Guard: `#/login` | ⬜ |

**ملاحظات:**
```

```

---

## TC-13 — Roadmap

**الأهمية:** MEDIUM  
**Pre-condition:** logged-in + active track

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 13.1 | `#/roadmap` | صفحة تفتح | ⬜ |
| 13.2 | 4 Steps | Basics → Courses → Projects → Job Ready | ⬜ |
| 13.3 | Steps متدرجة | Step 1 completed/active، باقي upcoming | ⬜ |
| 13.4 | كل step | title + description + status | ⬜ |
| 13.5 | `#/roadmap` بدون login | Guard: `#/login` | ⬜ |

**ملاحظات:**
```

```

---

## TC-14 — Courses

**الأهمية:** LOW  
**Pre-condition:** logged-in

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 14.1 | `#/courses` | صفحة تفتح | ⬜ |
| 14.2 | كل كورس | اسم + Free/Paid badge + زرار "ابدأ" | ⬜ |
| 14.3 | `#/courses` بدون login | Guard: `#/login` | ⬜ |

**ملاحظات:**
```

```

---

## TC-15 — Mentorship

**الأهمية:** LOW  
**Pre-condition:** logged-in

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 15.1 | `#/mentorship` | صفحة تفتح | ⬜ |
| 15.2 | Live Sessions / Q&A section | موجود | ⬜ |
| 15.3 | Book/Join button | موجود (ممكن disabled في MVP) | ⬜ |
| 15.4 | `#/mentorship` بدون login | Guard: `#/login` | ⬜ |

**ملاحظات:**
```

```

---

## Critical Path

> لو أي TC من هؤلاء فشل = MVP مش جاهز

| TC | الوصف | الأهمية |
|----|--------|--------|
| TC-02 | Test 7 أسئلة بدون login | **CRITICAL** |
| TC-03 | Result WOW + Decision card | **CRITICAL** |
| TC-04 | Track Details كامل | **CRITICAL** |
| TC-01 | Landing CTA واضح | HIGH |
| TC-09 | Layout Guard صح | HIGH |
