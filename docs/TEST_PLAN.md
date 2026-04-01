# TrackUp MVP — Test Plan

> **قواعد التنفيذ (إلزامية — لا استثناء)**
>
> - ✅ نفّذ كل **Use Case** بشكل **مستقل ومنفصل**
> - ✅ بعد كل Use Case **ارجع وسجّل النتيجة** قبل ما تكمل للي بعده
> - ✅ لو لقيت Error أو سلوك غلط → **سجّله بالضبط** في خانة الملاحظات
> - ✅ بعد التعديل والتأكيد → **ضع علامة `[DONE]`** قصاد الخطوة
> - ❌ **ممنوع** تخطي خطوة حتى لو بدت واضحة
> - ❌ **ممنوع** تطبيق أكتر من Use Case في نفس الوقت
> - ❌ **ممنوع** افتراض إن خطوة شغالة من غير ما تجربها فعلياً

---

## نظرة عامة على الـ Flow المستهدف

```
Landing → Test (7 أسئلة — بدون login) → Result (Top 3 + WOW) → Track Details
   ↓                                                                   ↓
 (اختياري)                                                    Roadmap / Courses
Register / Login → Dashboard
```

---

## TC-01 — Landing Page

**الهدف:** التأكد إن أول ما المستخدم يدخل يشوف CTA واضح يودّيه للـ Test

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 1.1 | افتح الموقع من صفحة فاضية (لا session، لا localStorage) | Landing تظهر — لا redirect | ⬜ |
| 1.2 | تأكد إن أول element واضح هو زرار "ابدأ الاختبار" / "Take the Test" | الزرار موجود وظاهر فوق الـ fold | ⬜ |
| 1.3 | تأكد إن التراكات الأربعة مذكورة بشكل خفيف (Power, Embedded, Communications, Career Shift) | موجودة كـ cards أو section — مش تقيلة | ⬜ |
| 1.4 | اضغط "ابدأ الاختبار" | Navigate لـ `/test` بدون أي login prompt | ⬜ |
| 1.5 | تأكد إن الـ Nav فيه: Plans, Sign In, Get Started | الروابط الثلاثة موجودة | ⬜ |
| 1.6 | اضغط "Plans" | Navigate لـ `/pricing` | ⬜ |
| 1.7 | في `/pricing` بدون login | فيه nav بـ Logo + Home + Sign In + Get Started | ⬜ |
| 1.8 | اضغط Logo أو Home في Pricing | ترجع للـ Landing | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-02 — Career Test (Guest Flow)

**الهدف:** المستخدم يكمل الـ 7 أسئلة من غير حساب

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 2.1 | افتح `/test` مباشرة من URL بدون session | الـ Test يظهر — لا redirect لـ login | ⬜ |
| 2.2 | السؤال الأول يظهر | Text السؤال + 4 خيارات كـ buttons | ⬜ |
| 2.3 | Progress bar تظهر في الأعلى | 0% أو 1/7 | ⬜ |
| 2.4 | اختار خيار من السؤال الأول | السؤال التالي يظهر بـ animation smooth | ⬜ |
| 2.5 | Progress bar تتقدم | تعكس الخطوة الحالية (مثلاً 2/7) | ⬜ |
| 2.6 | تابع الإجابة لحد السؤال الأخير (7) | كل سؤال يظهر بنفس الـ pattern | ⬜ |
| 2.7 | اضغط Back في السؤال 3 | يرجع للسؤال 2 مع حفظ الإجابة القديمة | ⬜ |
| 2.8 | اختار خيار في آخر سؤال | Loading overlay يظهر — مش navigate فوراً | ⬜ |
| 2.9 | الـ Loading phases تتغير | "Analysing..." → "Measuring fit..." → "Ranking results..." | ⬜ |
| 2.10 | بعد الـ Loading | Navigate لـ `/results` | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-03 — Result Screen (WOW Moment)

**الهدف:** النتيجة تكون واضحة وسريعة وجذابة

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 3.1 | بعد Navigate لـ `/results` | Decision Moment card يظهر (مش الـ full results) | ⬜ |
| 3.2 | في الـ Decision Moment | Icon التراك + "We recommend: [Track Name]" | ⬜ |
| 3.3 | Score يعد | من 0% لـ قيمة حقيقية (مثلاً 89%) بـ animation | ⬜ |
| 3.4 | اضغط "See Full Analysis" | Card يختفي smooth → Full Results تظهر | ⬜ |
| 3.5 | في Full Results | Top Track card كبير فوق + نسبة التوافق | ⬜ |
| 3.6 | تحت الـ Top Track | Track 2 و Track 3 بنسب أصغر مع progress bars | ⬜ |
| 3.7 | الـ Bars تتملى | بـ animation تدريجي مش فجأة | ⬜ |
| 3.8 | "Why this track?" section موجود | 3 dimensions بـ labels ونسب واضحة | ⬜ |
| 3.9 | زرار "Explore [Track]" موجود | واضح كـ primary CTA | ⬜ |
| 3.10 | زرار "View Full Plan" موجود | موجود كـ secondary action | ⬜ |
| 3.11 | اضغط "Explore [Track]" | Navigate لـ `/career?id=[trackId]` | ⬜ |
| 3.12 | افتح `/results` مباشرة بدون عمل تست | Redirect لـ `/test` | ⬜ |
| 3.13 | عمل Refresh على `/results` بعد تست | النتيجة لسه موجودة (من localStorage) | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-04 — Track Details Page

**الهدف:** كل Track عنده محتوى كامل وواضح

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 4.1 | من Results اضغط "Explore Embedded" | `/career?id=embedded` يفتح | ⬜ |
| 4.2 | الصفحة فيها: وصف المجال | نص وصف موجود | ⬜ |
| 4.3 | الصفحة فيها: طبيعة الشغل | Field/Office/Lab موضح | ⬜ |
| 4.4 | الصفحة فيها: المهارات المطلوبة | قائمة skills موجودة | ⬜ |
| 4.5 | الصفحة فيها: مميزات وعيوب | Pros/Cons section موجود | ⬜ |
| 4.6 | الصفحة فيها: المرتبات (تقريبي) | رقم أو range موجود | ⬜ |
| 4.7 | الصفحة فيها: مستقبل المجال | Growth/Outlook section موجود | ⬜ |
| 4.8 | فيه زرار Back أو رجوع | يرجع لـ `/career` أو `/results` | ⬜ |
| 4.9 | افتح `/career?id=power` | Power Systems page تفتح بنفس الـ structure | ⬜ |
| 4.10 | افتح `/career?id=communications` | Communications page تفتح | ⬜ |
| 4.11 | افتح `/career?id=career-shift` | Career Shift page تفتح | ⬜ |
| 4.12 | افتح `/career` بدون id | قائمة كل التراكات تظهر | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-05 — Register Flow بعد النتيجة

**الهدف:** المستخدم بعد ما شاف النتيجة يسجّل ويدخل Dashboard مباشرة

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 5.1 | من Results اضغط "View Full Plan" | Navigate لـ `/decision-summary` | ⬜ |
| 5.2 | في Decision Summary | التراك المختار ظاهر + تفاصيل الخطة | ⬜ |
| 5.3 | اضغط "Start My Path" كـ guest | Navigate لـ `/register` | ⬜ |
| 5.4 | املأ الـ Register form وسجّل | بعد التسجيل → navigate لـ `/dashboard` (مش `/onboarding`) | ⬜ |
| 5.5 | في Dashboard بعد التسجيل | نتيجة التست موجودة + Track محدد | ⬜ |
| 5.6 | افتح `/register` من اللينك العادي (مش من Decision) | بعد التسجيل → `/onboarding` | ⬜ |
| 5.7 | اضغط Logo في Register screen | Navigate لـ `/` (Landing) | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-06 — Login Flow

**الهدف:** الـ Redirect بعد Login يبقى smart حسب حالة المستخدم

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 6.1 | Login بـ `demo@trackup.io / demo1234` | Navigate لـ `/dashboard` | ⬜ |
| 6.2 | Login بـ حساب عنده `activeTrackId` | Navigate لـ `/dashboard` | ⬜ |
| 6.3 | Login بـ حساب جديد (مش عنده track، مش عنده result) | Navigate لـ `/onboarding` | ⬜ |
| 6.4 | عمل Test كـ guest → فتح `/login` → Login | Navigate لـ `/results` (عنده result في State) | ⬜ |
| 6.5 | اضغط Logo في Login screen | Navigate لـ `/` (Landing) | ⬜ |
| 6.6 | Login وانت logged-in بالفعل | Redirect لـ `/dashboard` (مش Login screen يظهر) | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-07 — Demo Button

**الهدف:** الـ Demo يوريك كيف الـ App بيشتغل بسرعة

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 7.1 | اضغط "Try Without Signing Up" في Landing | Toast "Loading demo..." يظهر | ⬜ |
| 7.2 | بعد ~400ms | Navigate لـ `/dashboard` | ⬜ |
| 7.3 | في Dashboard | Track = Embedded Systems، نتيجة موجودة، enrollments موجودة | ⬜ |
| 7.4 | اضغط Demo تاني مرة (بيانات قديمة موجودة) | البيانات القديمة اتمسحت — Demo جديد fresh | ⬜ |
| 7.5 | بعد Demo: عمل Refresh | Session تفضل (user demo موجود في localStorage) | ⬜ |
| 7.6 | اضغط Demo من الـ Final CTA Section في Landing | نفس السلوك بالظبط زي 7.1 | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-08 — Back Navigation

**الهدف:** المستخدم ما يبقاش محاصر في أي screen

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 8.1 | في `/test` فيه زرار Exit أو Back | موجود ويشتغل | ⬜ |
| 8.2 | اضغط Back في Test سؤال 3 | يرجع للسؤال 2 | ⬜ |
| 8.3 | في `/onboarding` step 0 | فيه "Home" button (مش مخفي) | ⬜ |
| 8.4 | اضغط Home في Onboarding step 0 | Navigate لـ `/` | ⬜ |
| 8.5 | في `/login` | Logo "TrackUp" هو `<a href="#/">` | ⬜ |
| 8.6 | اضغط Logo في Login | Navigate لـ `/` | ⬜ |
| 8.7 | في `/register` | Logo "TrackUp" هو `<a href="#/">` | ⬜ |
| 8.8 | اضغط Logo في Register | Navigate لـ `/` | ⬜ |
| 8.9 | في `/pricing` بدون login | فيه "Home" button في الـ public nav | ⬜ |
| 8.10 | اضغط Home في Pricing | Navigate لـ `/` | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-09 — Layout Guard

**الهدف:** Sidebar و Topbar يظهروا في الوقت الصح بس

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 9.1 | افتح `/` بدون login | لا Sidebar، لا Topbar | ⬜ |
| 9.2 | افتح `/test` بدون login | لا Sidebar، لا Topbar | ⬜ |
| 9.3 | افتح `/results` بعد تست (guest) | لا Sidebar، لا Topbar | ⬜ |
| 9.4 | افتح `/pricing` بدون login | لا Sidebar، لا Topbar — بس فيه public nav | ⬜ |
| 9.5 | Login → افتح `/dashboard` | Sidebar موجود + Topbar موجود | ⬜ |
| 9.6 | وانت logged-in: افتح `/results` | لا Sidebar فوق الـ Results (لأنه في NO_LAYOUT_SCREENS) | ⬜ |
| 9.7 | وانت logged-in: افتح `/test` | لا Sidebar فوق الـ Test | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-10 — Language Switch (EN ↔ AR)

**الهدف:** كل الـ app يتحول للعربي مع RTL كامل

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 10.1 | في Landing: غيّر اللغة لـ AR | النصوص بالعربي + dir=rtl | ⬜ |
| 10.2 | اضغط "ابدأ الاختبار" | الـ Test يفتح بالعربي | ⬜ |
| 10.3 | الأسئلة بالعربي | `textAr` يظهر مكان `text` | ⬜ |
| 10.4 | النتائج بالعربي | كل الـ labels بالعربي | ⬜ |
| 10.5 | عمل Refresh | اللغة عربي لسه (من localStorage) | ⬜ |
| 10.6 | رجّع للـ EN | النصوص ترجع إنجليزي | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-11 — Dark Mode

**الهدف:** الـ theme يتبدل ويتحفظ

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 11.1 | Toggle Dark Mode | كل الـ screens تتحول فوراً | ⬜ |
| 11.2 | عمل Refresh | الـ theme فضل dark (مش رجع light) | ⬜ |
| 11.3 | رجّع Light Mode | كل الـ screens ترجع light | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-12 — Dashboard (بعد Login)

**الهدف:** Dashboard يوري المعلومات الصح للمستخدم

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 12.1 | Login كـ Demo → Dashboard | اسم المستخدم في الـ Topbar | ⬜ |
| 12.2 | Active Track موجود | Embedded Systems ظاهر كـ active track | ⬜ |
| 12.3 | Progress موجود | نسبة إنجاز ظاهرة | ⬜ |
| 12.4 | Sidebar links | Dashboard, Career, Roadmap, Courses, Mentorship, Progress | ⬜ |
| 12.5 | اضغط Roadmap | `/roadmap` يفتح | ⬜ |
| 12.6 | اضغط Courses | `/courses` يفتح | ⬜ |
| 12.7 | اضغط Mentorship | `/mentorship` يفتح | ⬜ |
| 12.8 | اضغط Logout | Navigate لـ `/` + session اتمسح | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-13 — Roadmap

**الهدف:** Roadmap يبيّن الخطوات الـ 4 بوضوح

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 13.1 | افتح `/roadmap` | الصفحة تفتح | ⬜ |
| 13.2 | فيه Steps: Basics → Courses → Projects → Job Ready | الـ 4 steps موجودين | ⬜ |
| 13.3 | Steps متدرجة | Step 1 completed أو active، باقيهم locked أو upcoming | ⬜ |
| 13.4 | كل Step فيه تفاصيل | Title + description + status | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-14 — Courses

**الهدف:** قائمة Courses تظهر بشكل صح

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 14.1 | افتح `/courses` | الصفحة تفتح | ⬜ |
| 14.2 | كل كورس فيه: اسم | موجود | ⬜ |
| 14.3 | كل كورس فيه: مجاني/مدفوع | موجود | ⬜ |
| 14.4 | كل كورس فيه: زرار "ابدأ" | موجود (حتى لو لينك وهمي) | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## TC-15 — Mentorship (Live Session)

**الهدف:** Live Session section موجود حتى كـ Placeholder

| # | الخطوة | النتيجة المتوقعة | الحالة |
|---|--------|-----------------|--------|
| 15.1 | افتح `/mentorship` | الصفحة تفتح | ⬜ |
| 15.2 | فيه section للـ Live Sessions أو Q&A مع Mentor | موجود | ⬜ |
| 15.3 | زرار Book أو Join | موجود (ممكن يبقى disabled في MVP) | ⬜ |

**ملاحظات:**
```
[اكتب هنا أي errors أو سلوك غير متوقع]
```

---

## Critical Path Summary

> هذه الـ 5 Test Cases هي المحور الأساسي للـ MVP.
> لو أي واحدة منهم فاشلة = الـ MVP مش جاهز.

| Test Case | الوصف | الأهمية |
|-----------|--------|--------|
| TC-02 | Test من غير login | CRITICAL |
| TC-03 | Result WOW moment | CRITICAL |
| TC-04 | Track Details كامل | CRITICAL |
| TC-01 | Landing → CTA واضح | HIGH |
| TC-09 | Layout Guard صح | HIGH |

---

## Legend

| رمز | المعنى |
|-----|--------|
| ⬜ | لم يُجرَّب بعد |
| ✅ | نجح |
| ❌ | فشل — مسجّل في الملاحظات |
| 🔧 | تم التعديل — ينتظر إعادة الاختبار |
| ~~✅~~ DONE | تم التأكيد بعد التعديل |
