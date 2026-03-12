**Purpose**: Lightweight directory solving fragmented club discovery at UI - students find niche communities; organizers post external registration links (WhatsApp/Google Forms) with targeting and click tracking by dept/interests.

## Complete Feature Details

- **Posting**: Account holders only; form for club name, description, image/banner, external link, tags/interests, targeting (public/all, specific depts like "Computer Science", or exclusions).
- **Trackable Redirects**: Auto-generate uninav.live/clubs/[id] → external URL; logs clicks, dept (from profile/IP), timestamps; anonymized stats dashboard for organizers (total clicks, by-dept breakdown, trends, CSV export).
- **Discovery Feed**: Searchable page tab/feed; personalized by user interests/dept; filters (interests); targeted clubs prominent to matches, hidden from non-targets unless public.
- **User Profiles/Onboarding**: Modify onboarding & profile page to accept “multiple interests”
    
     3-step: dept → pick 5 interests → done; powers recs, targeting, notifications.
    
- **Notifications**: Email alerts for new matching clubs (e.g., "New Coding Club for CS!"); limit 1-2/week/user to avoid spam.
- **Request Club**: Button on club page/public queue: "No AI club? Request it" → email to admins/organizers.
- **Moderation**: User flagging → admin review/approve/hide; no upfront approval.
- **Organizer Dashboard**: Edit/delete anytime; view click analytics.
- **Promotion**: "Join related clubs?" on materials pages.
- **No New Auth**: Uses existing UniNav login; no-login browsing for discovery.

## How It Works

Organizers post targeted clubs → UniNav tracks/views/redirects → students discover via feed/search/notifications → clicks logged → organizers iterate from stats. 

## Typical Flows

**Club Seekers**

1. Browse/search clubs (personalized feed).
2. Filter by interest/dept → view details.
3. "Join Now" → tracked redirect.
4. Receive emails for matches or request missing clubs.

**Organizers**

1. Login → "Post Club" form with targeting.
2. Publish → monitor dashboard (clicks by dept).
3. Edit/delete; respond to requests/flags.

**Admins**

1. Review flagged clubs → approve/hide.
2. Seed initial clubs; handle requests.
3. Monitor analytics for platform health.

Side Note: club seekers, organizers, and admins are users(students)  of uninav, there’s no separate authentication procedure for these user types; it’s just dependent on context.

---

## Required Pages/Modals

Integrate into UniNav's existing dashboard/auth - no new login pages. Use modals for quick actions (e.g., post/edit). Prioritize mobile-first cards/lists.

## Shared Pages

- **Clubs Feed** (/clubs): Searchable directory/listing with filters (dept/interest), personalized recs, club cards (name, desc, image, "Join Now" button).
- **Club Detail** (/clubs/[id]): Full view (desc, targeting info, stats if public, flag/report button, "Request Similar" modal).

## Seekers (Students, No Login for Browse)

- **Clubs Feed** (above).
- **Club Detail** (above).
- **Profile Edit Modal**: Update dept/interests (onboarding or settings).
- **Request Club Modal**: On detail/feed (form: name, interest → submit).

## Organizers (Logged-In Users)

- **Post Club Modal**: From feed/button (form: all details/targeting/link).
- **My Clubs Dashboard** (/clubs/my): List own clubs, edit/delete modals, analytics table (clicks by dept/trends/export).
- **Edit Club Modal**: Update form (pre-filled).

## Admins (Special Role)

- **Admin Clubs Dashboard** (/admin/clubs): Full list (search/filter), status (live/flagged), bulk actions.
- **Flag Review Modal/Page** (/admin/flags): Review queue (club preview, reason, approve/hide).
- **Requests Queue** (/admin/requests): List user requests → notify/post.

**Total**: 5 core pages + 6 modals. Reuse materials search UI; add to nav as "Clubs"
