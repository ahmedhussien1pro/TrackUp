# TrackUp — Product Requirements Document (POC)

## 1. Product Overview

TrackUp is a guided career selection platform that helps engineering students choose their career path through a structured step-by-step journey.

Instead of browsing randomly, the user follows a clear flow:
Assessment → Recommendation → Exploration → Mentorship → Specialization → Roadmap

---

## 2. Problem Statement

طلاب كتير بيبقوا تايهين بين التراكات (Power / Embedded / Communications / Software)  
وبيبقوا محتاجين:

- يفهموا كل مجال
- يختاروا صح
- يبدأوا بخطة واضحة

---

## 3. Solution

TrackUp بيقدم:

- Career Test بسيط
- ترشيح أفضل مسارات
- شرح واضح لكل مجال
- Mentor Guidance
- Roadmap مخصصة

---

## 4. Target Users

### 1. Explorer

مش عارف يختار تخصص

### 2. Semi-Decided

عارف المجال العام (Software مثلًا) لكن محتار في التخصص

### 3. Focused

عارف هو عايز إيه وعايز roadmap + guidance

---

## 5. Core User Flow

1. User يدخل كـ Guest
2. يبدأ التقييم (Start Assessment)
3. يدخل بيانات بسيطة (اسم – كلية – حالة)
4. Decision:
   - لو مش عارف → Pre-Test
   - لو عارف → يختار Track
5. Pre-Test يطلع Top 3 Tracks
6. المستخدم يختار:
   - Free Preview
   - Upgrade
7. لو Paid:
   - Full Track Experience
   - Mentor Guidance
8. بعد كده:
   - Specialization Test
9. يتعمله:
   - Personalized Profile
10. يبدأ:

- Roadmap + Progress Tracking

---

## 6. Features (MVP Scope)

### 6.1 Guest Mode

- تصفح الموقع
- بدء التقييم بدون تسجيل

---

### 6.2 Onboarding

- Name
- College
- Student / Graduate
- Knows track? (Yes / No)

---

### 6.3 Pre-Test

- 5 أسئلة MCQ
- تحديد الاتجاه العام (Software / Hardware / Hybrid)

---

### 6.4 Track Recommendation

- عرض Top 3 Tracks
- نسبة مئوية
- Why this track (سبب بسيط)

---

### 6.5 Free Experience

- Overview للتراك
- جزء من Roadmap
- CTA للترقية

---

### 6.6 Paid Experience

- شرح كامل للتراك
- Roadmap كاملة
- فيديوهات
- Resources & Platforms
- Career Insights

---

### 6.7 Mentor System

#### Types:

- Featured Mentors (Sessions)
- Active Mentors (Chat + Booking)

#### Actions:

- Chat
- Book Session

---

### 6.8 Specialization

- اختبار ثاني
- تحديد تخصص دقيق (Frontend / Backend / Embedded...)

---

### 6.9 Profile

- Track + Specialization
- Checklist Roadmap
- Progress Tracking

---

## 7. Monetization

### Free:

- Preview فقط

### Paid:

- Full access + Mentors + Roadmap

---

## 8. Key Business Logic

- Pre-Test → يحدد Top Tracks
- Specialization Test → يحدد Role
- Upgrade → يفتح المحتوى المقفول

---

## 9. Success Metrics

- Completion Rate للـ Test
- Conversion Rate (Free → Paid)
- Mentor Bookings
- Roadmap Engagement

---

## 10. MVP Goal

أي مستخدم:

- يدخل
- يعمل Test
- يشوف نتيجة
- يفهم التراك
- يحس إن عنده خطة

👉 لو ده حصل = MVP ناجح
