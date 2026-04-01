# TrackUp MVP — Test Plan

> **قواعد التنفيذ (إلزامية — لا استثناء)**
>
> 1. نفّذ كل **Test Case** بشكل **مستقل** واحد بواحد
> 2. بعد كل TC ارجع وسجّل كل نتيجة قبل ما تكمل للتالي
> 3. لو لقيت Error أو سلوك غلط → سجّله في خانة **الملاحظات** بالتفصيل
> 4. بعد التعديل والتأكيد → ضع **`[DONE]`** قصاد الخطوة وغيّر ⬜ إلى ✅
> 5. ❌ ممنوع تخطي خطوة حتى لو بدت واضحة
> 6. ❌ ممنوع تطبيق أكتر من TC واحد في نفس الوقت
> 7. ❌ ممنوع افتراض إن خطوة شغالة من غير ما تجربها فعلياً

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
**الشرط المسبق:** امسح localStorage بالكامل قبل البدء (DevTools → Application → Clear All)  
**الهدف:** أول ما يشوفه المستخدم هو CTA واضح يودّيه للـ Test

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 1.1 | افتح الموقع من صفحة فاضية (لا session، لا localStorage) | Landing تظهر — لا redirect | ⬜ |
| 1.2 | تأكد إن زرار "ابدأ الاختبار" / "Take the Test" ظاهر فوق الـ fold | الزرار موجود ولا يحتاج scroll | ⬜ |
| 1.3 | تأكد وجود 4 Track cards (Power, Embedded, Communications, Career Shift) | موجودة بشكل خفيف — مش heavy content | ⬜ |
| 1.4 | اضغط "Take the Test" | Navigate لـ `#/test` بدون login prompt | ⬜ |
| 1.5 | تأكد وجود Nav: Plans + Sign In + Get Started | الثلاثة موجودة في أعلى الصفحة | ⬜ |
| 1.6 | اضغط "Plans" | Navigate لـ `#/pricing` | ⬜ |
| 1.7 | في `/pricing` بدون login | public nav ظاهر: Logo + Home + Sign In + Get Started | ⬜ |
| 1.8 | اضغط Home في Pricing nav | Navigate لـ `#/` | ⬜ |
| 1.9 | في Landing اضغط أي Track card "تعرف أكثر" | Navigate لـ `#/career?id=[trackId]` | ⬜ |
| 1.10 | في Landing اضغط "Get Started" | Navigate لـ `#/register` | ⬜ |

**ملاحظات:**
```

```

---

## TC-02 — Career Test — Guest Flow

**الأهمية:** CRITICAL  
**الشرط المسبق:** localStorage فارغ، لا session  
**الهدف:** مستخدم Guest يكمل الـ 7 أسئلة بدون حساب

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 2.1 | افتح `#/test` مباشرة من URL بدون session | Test يظهر — لا redirect لـ login | ⬜ |
| 2.2 | السؤال الأول يظهر | Text بالإنجليزي + 4 buttons بحرف (A, B, C, D) | ⬜ |
| 2.3 | Progress bar في الأعلى تظهر | تبدأ بـ ~14% (1/7) | ⬜ |
| 2.4 | Context label موجود | "Building your creativity profile" أو ما شابهه | ⬜ |
| 2.5 | Progress dots موجودة | 7 dots — الأول active | ⬜ |
| 2.6 | اختار خيار من السؤال الأول | بعد 280ms — السؤال الثاني يظهر بـ slide animation | ⬜ |
| 2.7 | Progress bar و dots تتحدّث | 2/7 — تنعكس الخطوة | ⬜ |
| 2.8 | اكمل الإجابة لحد السؤال السادس (6) | كل سؤال يظهر بنفس الـ pattern | ⬜ |
| 2.9 | اختر إجابة السؤال السابع (7) | Loading screen يظهر — لا navigate فوراً | ⬜ |
| 2.10 | الـ Loading screen | فيه 3 dots animation + "Building your career decision..." | ⬜ |
| 2.11 | بعد ~1600ms | Navigate لـ `#/results` | ⬜ |
| 2.12 | في أي سؤال: اضغط Exit | Navigate لـ `#/` (Landing) | ⬜ |

**ملاحظات:**
```

```

---

## TC-03 — Result Screen — WOW Moment

**الأهمية:** CRITICAL  
**الشرط المسبق:** TC-02 مكتمل — `testResult` موجود في State  
**الهدف:** النتيجة واضحة وسريعة ومحفّزة

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 3.1 | بعد Navigate لـ `/results` | Decision Moment card يظهر — لا full results بعد | ⬜ |
| 3.2 | Loading overlay يظهر أولاً | 3 phases: "Analysing" → "Measuring fit" → "Ranking results" | ⬜ |
| 3.3 | بعد ~1400ms: overlay يختفي | Decision Moment card يظهر بـ fade animation | ⬜ |
| 3.4 | في Decision Moment | Icon التراك + "We recommend: [Track]" + Score يعد | ⬜ |
| 3.5 | Score count-up | من 0% لـ القيمة الحقيقية خلال ~900ms | ⬜ |
| 3.6 | اضغط "See Full Analysis" | Decision card يختفي بـ opacity+transform → Full Results تظهر | ⬜ |
| 3.7 | في Full Results | Top Track card كبير + نسبة توافق + Confidence badge | ⬜ |
| 3.8 | "Why this track?" موجود | 3 dimensions بـ labels + scores + progress bars تتملى | ⬜ |
| 3.9 | Runner-up tracks (2، 3) | تظهر بتأخير تدريجي (stagger) مع bars | ⬜ |
| 3.10 | زرار "Explore [Track]" | واضح كـ primary CTA | ⬜ |
| 3.11 | زرار "View Full Plan" (rc-summary-btn) | واجود كـ secondary | ⬜ |
| 3.12 | زرار "Retake" | واجود كـ ghost | ⬜ |
| 3.13 | اضغط "Explore [Track]" | Navigate لـ `#/career?id=[topTrackId]` | ⬜ |
| 3.14 | اضغط "View Full Plan" | Enroll in track ثم Navigate لـ `#/decision-summary` | ⬜ |
| 3.15 | اضغط "Retake" | SweetAlert2 تأكيد يظهر — confirm → testResult اتمسح → `/test` | ⬜ |
| 3.16 | افتح `#/results` بدون عمل تست | Redirect لـ `#/test` | ⬜ |
| 3.17 | عمل Refresh على `#/results` بعد التست | النتيجة تجي من localStorage و decision moment يظهر | ⬜ |
| 3.18 | Save Banner | يظهر للـ guest فقط + dismiss يختفي ويحفظ في storage | ⬜ |

**ملاحظات:**
```

```

---

## TC-04 — Track Details Page

**الأهمية:** CRITICAL  
**الشرط المسبق:** لا يوجد شرط — صفحة Career عامة  
**الهدف:** كل Track عنده محتوى كامل وواضح

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 4.1 | افتح `#/career?id=embedded` | صفحة Embedded Systems تفتح | ⬜ |
| 4.2 | وصف المجال موجود | نص تعريفي واضح | ⬜ |
| 4.3 | طبيعة الشغل موجودة | Lab/Field/Office مبيّن | ⬜ |
| 4.4 | المهارات المطلوبة موجودة | قائمة skills واضحة | ⬜ |
| 4.5 | Pros / Cons موجودين | كل منهما 3 نقاط على الأقل | ⬜ |
| 4.6 | المرتبات (تقريبي) موجودة | رقم أو range ظاهر | ⬜ |
| 4.7 | مستقبل المجال موجود | Growth outlook section | ⬜ |
| 4.8 | زرار Back أو رجوع موجود | يرجع لـ `/career` أو browser back | ⬜ |
| 4.9 | افتح `#/career?id=power` | Power Systems تفتح بنفس الـ structure | ⬜ |
| 4.10 | افتح `#/career?id=communications` | Communications تفتح | ⬜ |
| 4.11 | افتح `#/career?id=career-shift` | Career Shift تفتح | ⬜ |
| 4.12 | افتح `#/career` بدون id | قائمة كل التراكات تظهر | ⬜ |
| 4.13 | فيديو Placeholder موجود | Section موجود حتى لو iframe أو placeholder div | ⬜ |

**ملاحظات:**
```

```

---

## TC-05 — Register Flow بعد النتيجة

**الأهمية:** HIGH  
**الشرط المسبق:** TC-02 و TC-03 مكتملين  
**الهدف:** بعد النتيجة يسجّل ويدخل Dashboard مباشرة

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 5.1 | من Results اضغط "View Full Plan" | Navigate لـ `#/decision-summary` | ⬜ |
| 5.2 | في Decision Summary | التراك المختار + strength sentence + stats | ⬜ |
| 5.3 | زرار "ابدأ مساري" / "Start My Path" موجود | واضح كـ primary CTA | ⬜ |
| 5.4 | اضغط "Start My Path" كـ guest | Toast يظهر + `committed_track_id` يتحفظ في storage | ⬜ |
| 5.5 | بعد 600ms | Navigate لـ `#/register` | ⬜ |
| 5.6 | في Register: املأ name + email + password واضغط submit | بعد التسجيل → navigate لـ `#/dashboard` (مش `/onboarding`) | ⬜ |
| 5.7 | في Dashboard | Track = التراك اللي committeده + نتيجة التست موجودة | ⬜ |
| 5.8 | افتح `#/register` بدون committed track | بعد التسجيل → `/onboarding` | ⬜ |
| 5.9 | اضغط Logo "TrackUp" في Register | Navigate لـ `#/` | ⬜ |
| 5.10 | تسجيل بـ email مستخدم من قبل | Error message "حساب موجود" يظهر | ⬜ |
| 5.11 | الحقول فاضية واضغط submit | Error validation يظهر | ⬜ |

**ملاحظات:**
```

```

---

## TC-06 — Login Flow — Smart Redirect

**الأهمية:** HIGH  
**الشرط المسبق:** localStorage فارغ لكل sub-case  
**الهدف:** Redirect بعد Login يكون smart حسب حالة المستخدم

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 6.1 | Login بـ `demo@trackup.io / demo1234` | Navigate لـ `/dashboard` (ليه activeTrackId) | ⬜ |
| 6.2 | Login بحساب جديد ليس عنده track ولا result | Navigate لـ `/onboarding` | ⬜ |
| 6.3 | عمل Test كـ guest → بعدين افتح `#/login` → login | Navigate لـ `/results` (result لسه في State) | ⬜ |
| 6.4 | اضغط Logo في Login screen | Navigate لـ `#/` | ⬜ |
| 6.5 | وانت logged-in بالفعل: افتح `#/login` | Redirect لـ `/dashboard` تلقائياً | ⬜ |
| 6.6 | Login ببيانات خاطئة | Error message يظهر — لا navigate | ⬜ |
| 6.7 | Login بحقول فاضية | Error validation يظهر | ⬜ |

**ملاحظات:**
```

```

---

## TC-07 — Demo Button

**الأهمية:** MEDIUM  
**الشرط المسبق:** localStorage فارغ  
**الهدف:** Demo يحمل بيانات fresh ويودّي لـ Dashboard

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 7.1 | اضغط "Try Without Signing Up" في Landing | Toast "Loading demo..." يظهر | ⬜ |
| 7.2 | بعد ~400ms | Navigate لـ `/dashboard` | ⬜ |
| 7.3 | في Dashboard | Track = Embedded Systems، Enrolled courses موجودة | ⬜ |
| 7.4 | عمل Refresh | User demo لسه في session + Dashboard يظهر | ⬜ |
| 7.5 | logout ثم Demo تاني مرة | كل البيانات القديمة اتمسحت — Demo جديد fresh | ⬜ |
| 7.6 | اضغط Demo من الـ Final CTA section في Landing | نفس السلوك بالضبط كـ 7.1–7.3 | ⬜ |

**ملاحظات:**
```

```

---

## TC-08 — Back Navigation

**الأهمية:** HIGH  
**الشرط المسبق:** لا session  
**الهدف:** المستخدم ما يبقاش محاصر في أي screen

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 8.1 | في `/test` | زرار "Exit" في أعلى يمين الشاشة موجود | ⬜ |
| 8.2 | اضغط Exit في Test | Navigate لـ `#/` (Landing) | ⬜ |
| 8.3 | في `/onboarding` step 0 | فيه "Home" button (مش مخفي) | ⬜ |
| 8.4 | اضغط Home في Onboarding step 0 | Navigate لـ `#/` | ⬜ |
| 8.5 | في Onboarding step 2 | فيه Back button يرجع لـ step 1 | ⬜ |
| 8.6 | في `/login` | Logo "TrackUp" هو `<a>` ليس `<span>` | ⬜ |
| 8.7 | اضغط Logo في Login | Navigate لـ `#/` | ⬜ |
| 8.8 | في `/register` | Logo "TrackUp" هو `<a>` | ⬜ |
| 8.9 | اضغط Logo في Register | Navigate لـ `#/` | ⬜ |
| 8.10 | في `/pricing` بدون login | public nav فيه Home button | ⬜ |
| 8.11 | اضغط Home في Pricing nav | Navigate لـ `#/` | ⬜ |
| 8.12 | في `/decision-summary` | فيه Back يرجع لـ `/results` (ds-back-results) | ⬜ |

**ملاحظات:**
```

```

---

## TC-09 — Layout Guard (Sidebar / Topbar)

**الأهمية:** HIGH  
**الشرط المسبق:** لا session  
**الهدف:** Sidebar + Topbar يظهران فقط للـ logged-in users في الصفحات الداخلية

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 9.1 | افتح `#/` بدون login | لا Sidebar، لا Topbar ظاهرين | ⬜ |
| 9.2 | افتح `#/test` بدون login | لا Sidebar، لا Topbar | ⬜ |
| 9.3 | افتح `#/results` بعد تست (guest) | لا Sidebar، لا Topbar | ⬜ |
| 9.4 | افتد `#/pricing` بدون login | لا Sidebar — لكن فيه public nav | ⬜ |
| 9.5 | Login ثم افتح `#/dashboard` | Sidebar ظاهر + Topbar ظاهر | ⬜ |
| 9.6 | وانت logged-in: افتح `#/results` | لا Sidebar — Results صفحة نظيفة | ⬜ |
| 9.7 | وانت logged-in: افتح `#/test` | لا Sidebar — Test صفحة نظيفة | ⬜ |
| 9.8 | بعد Login: Navigate لـ `/dashboard` ثم `/settings` | Active link في Sidebar يتغيّر | ⬜ |

**ملاحظات:**
```

```

---

## TC-10 — Language Switch (EN ↔ AR)

**الأهمية:** MEDIUM  
**الشرط المسبق:** لا session  

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 10.1 | في Landing: غيّر اللغة لـ AR | كل النصوص بالعربي + dir=rtl على `<html>` | ⬜ |
| 10.2 | اضغط "ابدأ الاختبار" | الـ Test يفتح بالعربي | ⬜ |
| 10.3 | أسئلة التست بالعربي | `textAr` يظهر + خيارات عربي (`labelAr`) | ⬜ |
| 10.4 | النتائج بالعربي | Track اسم + dimension labels + sentences كلها عربي | ⬜ |
| 10.5 | عمل Refresh | اللغة عربي لسه (localStorage `trackup__lang`) | ⬜ |
| 10.6 | رجّع للـ EN | النصوص ترجع إنجليزي + dir=ltr | ⬜ |

**ملاحظات:**
```

```

---

## TC-11 — Dark Mode

**الأهمية:** MEDIUM  

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 11.1 | Toggle Dark Mode | `data-theme="dark"` على `<html>` + كل الـ screens تتحول فوراً | ⬜ |
| 11.2 | عمل Refresh | localStorage حفظ dark — مش رجع light | ⬜ |
| 11.3 | Toggle لـ Light | كل الـ screens ترجع light | ⬜ |

**ملاحظات:**
```

```

---

## TC-12 — Dashboard

**الأهمية:** MEDIUM  
**الشرط المسبق:** Demo login مكتمل  

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 12.1 | في Dashboard | اسم المستخدم في الـ Topbar | ⬜ |
| 12.2 | Active Track موجود | Embedded Systems ظاهر | ⬜ |
| 12.3 | Progress ظاهر | نسبة إنجاز واضحة | ⬜ |
| 12.4 | Sidebar: كل الـ links ظاهرة | Dashboard, Career, Roadmap, Courses, Mentorship, Progress, Settings | ⬜ |
| 12.5 | اضغط Roadmap في Sidebar | Navigate لـ `/roadmap` | ⬜ |
| 12.6 | اضغط Courses | Navigate لـ `/courses` | ⬜ |
| 12.7 | اضغط Mentorship | Navigate لـ `/mentorship` | ⬜ |
| 12.8 | اضغط Logout في Topbar | Session اتمسح → Navigate لـ `#/` | ⬜ |

**ملاحظات:**
```

```

---

## TC-13 — Roadmap

**الأهمية:** MEDIUM  
**الشرط المسبق:** logged-in + active track  

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 13.1 | افتح `/roadmap` | الصفحة تفتح | ⬜ |
| 13.2 | 4 Steps موجودة | Basics → Courses → Projects → Job Ready | ⬜ |
| 13.3 | Steps متدرجة | Step 1 completed/active، باقي upcoming | ⬜ |
| 13.4 | كل step فيه title + description + status | واجبات مكتملة | ⬜ |

**ملاحظات:**
```

```

---

## TC-14 — Courses

**الأهمية:** LOW  
**الشرط المسبق:** logged-in  

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 14.1 | افتح `/courses` | الصفحة تفتح | ⬜ |
| 14.2 | كل كورس فيه: اسم + Free/Paid + زرار "ابدأ" | جميعها موجودة | ⬜ |

**ملاحظات:**
```

```

---

## TC-15 — Mentorship (Live Session)

**الأهمية:** LOW  
**الشرط المسبق:** logged-in  

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 15.1 | افتح `/mentorship` | الصفحة تفتح | ⬜ |
| 15.2 | فيه section للـ Live Sessions أو Q&A مع Mentor | موجود | ⬜ |
| 15.3 | زرار Book/Join | موجود (ممكن disabled في MVP) | ⬜ |

**ملاحظات:**
```

```

---

## Critical Path Summary

> **لو أي TC من هؤلاء فاشل = MVP مش جاهز**

| TC | الوصف | الأهمية |
|----|--------|--------|
| TC-02 | Test من غير login — 7 أسئلة كاملة | **CRITICAL** |
| TC-03 | Result WOW moment — Decision ثم Full Analysis | **CRITICAL** |
| TC-04 | Track Details — محتوى كامل | **CRITICAL** |
| TC-01 | Landing CTA واضح | HIGH |
| TC-09 | Layout Guard | HIGH |
