# TrackUp — Product Requirements Document (PRD)

## 1. Overview

TrackUp is a guided career selection platform designed to help engineering students and graduates choose the right career track through a structured step-by-step journey.

The platform eliminates confusion by guiding users from:
Confusion → Recommendation → Decision → Specialization → Roadmap → Execution

---

## 2. Goals

### Primary Goal

Help users identify the most suitable career track and start a clear learning path.

### Secondary Goals

- Convert users from free → paid
- Provide personalized learning journeys
- Enable mentorship-driven decisions
- Track user progress over time

---

## 3. Target Users

### 1. Explorers

- Don’t know which track to choose

### 2. Semi-Decided Users

- Know general field (e.g., Software) but not specialization

### 3. Focused Users

- Know what they want but need roadmap + mentorship

---

## 4. Core User Flow

1. User visits platform (Guest)
2. Starts assessment
3. Enters basic info (name, college, status)
4. Decision:
   - If doesn't know track → Pre-Test
   - If knows track → Select directly
5. Pre-Test → Top 3 tracks
6. User chooses:
   - Free preview
   - Upgrade to paid
7. Paid users:
   - Access full track experience
   - Access mentor guidance
8. Mentor Layer:
   - Chat or Book session
9. Specialization Test
10. Personalized Profile generated
11. User follows roadmap + progress tracking

---

## 5. Features Breakdown

## 5.1 Guest Experience

- Browse homepage, pricing, about
- Start assessment without login
- Temporary session storage

---

## 5.2 Onboarding (Light)

- Name
- College / Major
- Student / Graduate
- Knows track? (Yes / No)

---

## 5.3 Pre-Test Engine

- 5 MCQ questions
- Weighted scoring system
- Output: Top 3 tracks with percentages

---

## 5.4 Track Recommendation

- Show top 3 tracks
- Show short explanation (Why this track)

---

## 5.5 Free Experience (Gated)

User can:

- View track overview
- View partial roadmap

User cannot:

- View full roadmap
- Access courses/resources
- Access mentors
- View deep analysis

---

## 5.6 Paid Experience

Unlocks:

- Full track details
- Full roadmap
- Learning resources & platforms
- Recorded sessions
- Career insights (salary, future)

---

## 5.7 Mentor System

### Types:

1. Featured Mentors
   - Experts / known figures
   - Live sessions (scheduled)

2. Active Mentors
   - Available for chat
   - Bookable sessions

### Capabilities:

- Chat system
- Session booking
- Recommendations based on track

---

## 5.8 Specialization System

- Secondary test based on selected track
- Outputs specific role:
  - Example: Frontend / Backend / Embedded Firmware

---

## 5.9 Personalized Profile

- Selected track + specialization
- Dynamic roadmap
- Checklist progress system
- Next step recommendation

---

## 5.10 Progress Tracking

- Completed steps
- Current stage
- Last activity
- Notifications (optional)

---

## 6. Monetization

### Free Tier:

- Limited preview
- No deep access

### Paid Tier:

- Full access
- Mentorship
- Resources
- Tracking

---

## 7. Business Logic

### Decision Logic:

- Pre-Test → Track scoring
- Specialization Test → Role mapping

### Upgrade Triggers:

- After results
- Inside free preview

---

## 8. Non-Functional Requirements

- Fast loading (low friction)
- Mobile responsive
- Simple UI (no clutter)
- Clear CTA per page

---

## 9. Success Metrics

- % users completing test
- Conversion rate (Free → Paid)
- Mentor session bookings
- Roadmap engagement
- User retention

---

## 10. Future Enhancements

- AI-based recommendations
- Smart reminders
- Gamification (badges, streaks)
- Community features
