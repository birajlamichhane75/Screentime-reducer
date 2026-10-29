# SkillBridge — TikTok-Style Talent & Opportunity Discovery Platform

> **TikTok helps people discover entertaining content. SkillBridge helps organizations discover talented people.**  
> A mobile-first, simplified talent discovery platform where creators upload short videos showcasing their hobbies, passions, and skills, while universities, companies, clubs, and scouting organizations discover and directly connect with them.

---

## 1. Simplified Product Overview & The 14 UI Screens

The platform is designed around 14 mobile-first screens:

| Screen # | Screen Name | Route | Core Functionality |
| :---: | :--- | :--- | :--- |
| **1** | **Landing Page** | `/` | Hero *"Your Talent Deserves to Be Seen."*, showcase cards, 3 steps, and explore CTA. |
| **2** | **Login Page** | `/login` | Email/password sign-in with Google/Apple single-click demo accounts. |
| **3** | **Signup (Role Selection)** | `/signup` | Selection between *"I'm a Creator"* and *"I'm an Organization"*. |
| **4** | **Signup (Details)** | `/signup/details` | Profile photo upload, Full Name, Email, Password. |
| **5** | **Creator Home (Video Feed)** | `/feed` | Full-screen vertical video feed, horizontal category pills, tap to play/pause, like, comment, and share. |
| **6** | **Explore Page** | `/explore` | Search bar, category chips, and 2-column video thumbnail grid with view counts. |
| **7** | **Upload Video Page** | `/upload` | Video picker & preview (`00:15`), caption counter (`0/200`), category picker, and **`+ Add Custom Category`** support. |
| **8** | **Creator Profile Page** | `/profile` | Instagram-style profile with stats (Videos, Followers, Following), bio, tags, Edit/Upload buttons, and 3-column video grid. |
| **9** | **Edit Profile Page** | `/profile/edit` | Edit full name, username, bio, category tags (with remove/add), and location. |
| **10** | **Organization Discover Page** | `/discover` | Search singers, artists, athletes by category/keyword with 2-column video grid. |
| **11** | **Organization Video Viewer** | `/video/[id]` | Full-screen playback with elapsed duration, Follow, Save creator, and Contact talent buttons. |
| **12** | **Saved Talent Page** | `/saved` | List of bookmarked creators with category badges, View Profile, and remove bookmark. |
| **13** | **Contact Talent Modal** | Component | Bottom-sheet dialog with Opportunity Title, Message (`0/500`), and direct invitation submission. |
| **14** | **Notifications (Creator)** | `/notifications` | Tabbed notification inbox (`All \| Opportunities \| System`) displaying invitations from universities & clubs. |


---

## 2. Technology Stack

- **Framework:** Next.js 16.4.3 (App Router with Turbopack, Partial Prerendering & Cache Components)
- **Frontend Core:** React 19, TypeScript (Strict Mode)
- **Styling & Design System:** Tailwind CSS v4, Lucide React icons, customized Indigo/Teal/Amber color palette
- **Data Analytics & Charts:** Recharts (responsive area charts, bar charts, funnels)
- **Validation:** Zod schemas for all client and server payloads
- **Testing:** Vitest with strict unit, integration, and security assertion suites
- **Database & Backend:** Supabase PostgreSQL with 28 relational tables, Row Level Security (RLS), idempotent transaction functions, and `@supabase/ssr` cookies handler
- **Dual Persistence Architecture:** Built with an interactive Browser LocalStore fallback pre-populated with realistic demonstration data, allowing the entire application to be explored immediately out-of-the-box before connecting Supabase credentials.

---

## 3. Architecture & System Design

```mermaid
graph TD
    User([User / Browser])
    RoleSwitch([Role Switcher: Student | Org | Admin])
    
    subgraph FrontendApp [Next.js App Router]
        PublicLanding[Landing Page /]
        StudentPortal[Student Experience /(student)/*]
        OrgPortal[Organization Portal /(organization)/*]
        AdminPortal[Administrator Console /admin/*]
    end

    subgraph ServiceLayer [Business Logic & Services]
        MatchingEngine[Rule-Based Opportunity Matcher]
        RewardsLedger[Idempotent Rewards Ledger]
        Permissions[RBAC & Privacy Guard]
        DataStore[DataStore Adapter: Local & Supabase SSR]
    end

    subgraph DatabaseLayer [Supabase PostgreSQL + Storage]
        Postgres[(PostgreSQL 28 Core Tables)]
        RLSPolicies[Row Level Security Policies]
        StorageBuckets[Private Storage: project-media]
    end

    User --> RoleSwitch
    RoleSwitch --> PublicLanding
    RoleSwitch --> StudentPortal
    RoleSwitch --> OrgPortal
    RoleSwitch --> AdminPortal

    StudentPortal --> ServiceLayer
    OrgPortal --> ServiceLayer
    AdminPortal --> ServiceLayer

    ServiceLayer --> DataStore
    DataStore --> Postgres
    DataStore --> RLSPolicies
    DataStore --> StorageBuckets
```

---

## 4. Database Schema & Migrations

The database migration is located at:
`supabase/migrations/20261028000001_initial_schema.sql`

It creates the **28 required core tables**:
1. `profiles` (User role: student, organization, admin)
2. `skills` (Standardized skill taxonomy)
3. `user_skills` (User skill associations with proficiency levels)
4. `hobbies` (Hobby categories: Coding, Art, Music, etc.)
5. `user_hobbies` (User selected hobbies with daily goals)
6. `projects` (Portfolio projects)
7. `project_media` (Media assets attached to projects)
8. `challenges` (Platform creative challenges)
9. `activity_sessions` (Practice sessions and focus records)
10. `challenge_submissions` (Submissions evaluated for points)
11. `reward_events` (Immutable ledger of all points awarded)
12. `achievements` (Badge definitions)
13. `user_achievements` (Earned user badges)
14. `organizations` (Organization entities)
15. `organization_members` (User-organization memberships)
16. `organization_verification_requests` (Verification queue)
17. `opportunities` (Scholarships, internships, clubs, etc.)
18. `opportunity_skills` (Required and preferred skill mappings)
19. `applications` (Candidate opportunity applications)
20. `application_projects` (Selected portfolio items attached to applications)
21. `saved_opportunities` (Bookmarked opportunities)
22. `talent_shortlists` (Candidates bookmarked by organizations)
23. `organization_invitations` (Controlled invitations sent to talent)
24. `notifications` (In-app notifications)
25. `notification_preferences` (Email and push controls)
26. `screen_time_entries` (Voluntary screen-time journal)
27. `content_reports` (Safety and abuse reporting)
28. `audit_logs` (Administrative action audit trail)

### Database Functions & Triggers:
- `handle_new_user()`: Automatically provisions profile records upon Supabase Auth signup.
- `award_points_transaction()`: Idempotent transactional ledger function that enforces daily point caps and duplicate submission guards.
- Comprehensive **Row Level Security (RLS)** policies enabled across all 28 tables.

---

## 5. Security & Privacy Model

1. **Role-Based Access Control (RBAC):**
   - Strictly enforced at server route handlers and RLS database layers.
   - Users cannot elevate their own roles.
   - Unverified organizations cannot publish opportunities or contact talent.
2. **Conservative Privacy Defaults for Minors:**
   - No public phone numbers or exact geographic addresses.
   - Portfolios are discoverable only if explicitly opted-in by the user.
   - Unsolicited public direct messaging is intentionally disabled to safeguard young creators.
3. **Audit Trails & Moderation:**
   - All organization approvals and moderation decisions are logged with timestamps.
   - Built-in content reporting queue for administrator review.

---

## 6. Transparent Matching Engine

The recommendation system is rule-based and auditable:
- **Skill Overlap (40%):** Matches student's verified and self-reported skills against opportunity requirements.
- **Portfolio Relevance (30%):** Assesses whether the candidate has published projects directly matching the required discipline.
- **Activity Evidence (20%):** Evaluates consistent practice time in the relevant hobby category.
- **Preferences & Location (10%):** Compares remote/in-person availability and goal alignment.
- **Human-Readable Explanations:** Every match displays a breakdown (e.g., *"Recommended because your profile includes TypeScript and you completed 2 portfolio projects in Coding"*).

---

## 7. Local Development & Setup

### Prerequisites
- Node.js 20+ or 22+
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/skillbridge.git
cd skillbridge
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Configure your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(Note: If Supabase credentials are not provided initially, SkillBridge operates in offline demonstration mode using its persistent browser store).*

### 3. Apply Supabase Migrations
If using a live Supabase project:
```bash
npx supabase db push
# or execute supabase/migrations/20261028000001_initial_schema.sql in the Supabase SQL Editor
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Automated Tests
```bash
npm run test
```

### 6. Build for Production
```bash
npm run build
npm run start
```

---

## 8. Automated Test Suite Results

SkillBridge includes 16 automated tests covering business logic, security, matching, and screen time mathematics:

| Test Suite | Tests | Result | Description |
| :--- | :---: | :---: | :--- |
| `tests/matching.test.ts` | 3 | **PASSED** | Validates transparent matching weights, 0% score handling, and human explanation generation. |
| `tests/rewards.test.ts` | 3 | **PASSED** | Validates ledger points calculation, anti-abuse daily limits, and badge unlocking. |
| `tests/screenTime.test.ts` | 3 | **PASSED** | Validates daily difference math, annualized hours, and equivalent full days saved. |
| `tests/security.test.ts` | 4 | **PASSED** | Enforces RBAC permissions, unverified org restrictions, and privacy checks. |
| `tests/flows.test.ts` | 3 | **PASSED** | Validates complete student focus session, project creation, and opportunity application flows. |
| **Total** | **16** | **100% PASSED** | All tests executed with Vitest. |

---

## 9. API Reference

### Profiles & Auth
- `GET /api/me`: Returns current authenticated user profile, role, and settings.
- `GET /api/skills`: Returns standardized skill taxonomy.
- `GET /api/hobbies`: Returns active hobby categories.

### Sessions & Practice
- `GET /api/sessions`: List authenticated user's practice sessions.
- `POST /api/sessions`: Log completed focus session; triggers point ledger award.

### Projects & Portfolio
- `GET /api/projects`: Fetch projects (supports filtering by hobby and discoverability).
- `POST /api/projects`: Upload and publish a new project (+20 points).

### Opportunities & Applications
- `GET /api/opportunities`: Search and filter opportunities (type, remote, skills).
- `POST /api/opportunities`: Post new opportunity (verified organizations only).
- `GET /api/matches`: Calculate personalized recommendation match scores.
- `GET /api/applications`: List submitted applications.
- `POST /api/applications`: Apply to an opportunity with linked portfolio projects.

---

## 10. Role Switcher for Demonstration

SkillBridge includes an interactive **Role Switcher** in the top navigation bar:
- **Alex Morgan (Student / Talent):** Full access to Student Dashboard, Focus Mode, Portfolio Studio, Opportunities, Applications, and Screen-Time Tracker.
- **TechCorp Labs / Stanford AI Guild (Organization):** Access to Organization Dashboard, Candidate Applications pipeline, and Talent Search.
- **Platform Administrator:** Access to Admin Verification Queue (approve/reject partner organizations) and Platform Analytics.

---

## 11. Production Deployment Guide (Vercel)

1. Push your repository to GitHub / GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Import Project**.
3. Set the Framework Preset to **Next.js**.
4. Configure Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`).
5. Click **Deploy**. Turbopack will compile all 39 static and dynamic routes.

---

## 12. Known Limitations & Next Milestones

- **Self-Reported Timers:** Focus sessions currently rely on self-reported completion with optional project evidence uploads. Future updates will introduce optional client-side webcam timelapse attachments.
- **Screen-Time Device APIs:** Operating system restrictions in standard web browsers prevent reading system-level screen-time directly; data relies on user input or optional future mobile companion sync.
- **AI Matching Integration:** The matching architecture includes a modular provider interface ready to be plugged into Gemini or OpenAI embeddings behind the `AI_FEATURES_ENABLED` flag.
