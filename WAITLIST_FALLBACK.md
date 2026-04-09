# Waitlist Fallback Plan (Resend Not Yet Configured)

Companion to `WAITLIST.md`. Covers what to do *right now* while `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` are missing.

---

## 1. What UX Should Happen When Env Vars Are Missing

**Current behavior**: The API returns `{ ok: true }` and the form shows "You're on the list!" even though nothing was saved. This is the worst option. It erodes trust the moment a user checks their inbox and never hears from you, and you lose a real lead.

**Recommended behavior**: Return an honest error and show the user an alternative way to signal interest.

Concretely, `subscribe.ts` should return a distinct response when env vars are missing:

```ts
if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID) {
  console.error('Resend env vars not configured.');
  return Response.json(
    { ok: false, unavailable: true, error: 'Signup is temporarily unavailable.' },
    { status: 503, headers: corsHeaders }
  );
}
```

The client-side script should detect `unavailable: true` and show a fallback CTA (see section 3 for copy).

**Why not hide the form entirely?** The form still serves a purpose: it signals that the product exists and is coming. Hiding it removes the strongest CTA on the page. Better to keep the form visible and handle the unavailable state gracefully.

---

## 2. Ranked Interim Fallback Options

These are ways to capture real interest while Resend is not wired up. Ranked by speed-to-implement and reliability.

### Rank 1: Tally.so free form (recommended, 5 minutes)

- Create a one-field form at tally.so (no account required for basic use, free forever for core features)
- Responses go to Tally's dashboard and can export to CSV
- In the unavailable state, show a link: "Sign up via our waitlist form" pointing to the Tally URL
- No code change beyond the error-state copy
- Tally forms look clean and professional, no "powered by" branding on free tier

### Rank 2: Google Form with linked Sheet (10 minutes)

- Create a Google Form with one email field
- Link it to a Google Sheet for automatic response collection
- Show the form link in the unavailable state
- Downside: Google Forms look generic. Not a big deal for a fallback nobody expects to need.

### Rank 3: Loops.so free API (15-20 minutes)

- Same recommendation as WAITLIST.md Option A
- Requires modifying `subscribe.ts` to call Loops API instead of Resend
- More work than a simple link, but captures emails through the existing form UI
- Best option if Resend will be delayed more than a week

### Rank 4: mailto link (2 minutes, last resort)

- Show: "Email us at hello@crontinel.com to join the waitlist"
- Zero infrastructure, captures intent via inbox
- Downside: high friction, many users will not bother

---

## 3. Form Copy for Each State

### Normal state (form is functional)

- **Placeholder**: `you@yourapp.com`
- **Button**: `Get early access`
- **Subtext**: `No credit card. No spam. Unsubscribe anytime.`

### Success state (email captured)

- **Message** (green): `You're on the list! We'll email you when Crontinel launches.`
- Button stays disabled, form resets.

### Unavailable state (env vars missing, 503 returned)

- **Current live fallback** (amber/yellow): `Waitlist is temporarily unavailable. Follow us on X @crontinel for launch updates.`
  - `@crontinel` links to `https://x.com/crontinel`
  - This is the current no-extra-account fallback already wired into the landing page.
- **Preferred richer fallback**: `Signup is temporarily unavailable. Join via our waitlist form instead.`
  - "waitlist form" can point to a Tally.so or Google Form URL once one exists.
- **Alternative if using mailto**: `Signup is temporarily unavailable. Email hello@crontinel.com to join the waitlist.`
- Button re-enables so the user can retry later.

### Error state (Resend API failure, 500 returned)

- **Message** (red): `Failed to subscribe. Please try again.` (already implemented)
- Button re-enables.

### Network error (fetch throws)

- **Message** (red): `Network error. Please try again.` (already implemented)

---

## 4. Implementation Plan: Fallback to Real Capture

Once Resend is configured (keys exist in CF Pages env vars), the transition is:

### Step 1: Set env vars in Cloudflare Pages

Follow the checklist in `WAITLIST.md` section 4, steps 1-3. This is the only blocker.

### Step 2: Remove the fallback link from client-side code

The client-side `unavailable` handling becomes dead code once the API returns `{ ok: true }` for real. You can leave it in as defensive code or remove it. Leaving it in is safer: if keys are ever rotated or deleted, the fallback activates automatically.

### Step 3: Run smoke tests

Follow `WAITLIST.md` section 5. All five tests should pass.

### Step 4: Import any fallback signups

- Export emails from Tally.so (or Google Sheet) as CSV
- Import into Resend audience via dashboard: Audiences > Crontinel Waitlist > Import Contacts
- Delete or archive the Tally form to avoid duplicate capture paths

### Step 5: Verify no one fell through the cracks

- Compare the Tally export count against the Resend audience count after import
- Send a test broadcast to the audience to confirm deliverability

---

## 5. Manual Interest Tracking in the Meantime

Even without automated capture, you can measure interest:

### Cloudflare Pages Analytics (already active)

- CF Pages provides free analytics: unique visitors, page views, top paths
- Check: Cloudflare Dashboard > Pages > crontinel-landing > Analytics
- Track the trend line of visitors to `/` (the page with the form)
- No setup needed; this is on by default

### Google Analytics (if GA4 is configured)

- `PUBLIC_GA_MEASUREMENT_ID` exists in `.env.example`, so GA may already be live
- Set up an event for form submissions: track the `submit` event on `#waitlist-form`
- Even without Resend, you can count how many people *tried* to sign up

### UTM tracking for inbound links

- When sharing the landing page (Reddit, Twitter, forums), append UTM params:
  `https://crontinel.com/?utm_source=reddit&utm_medium=comment&utm_campaign=launch`
- GA4 picks these up automatically; CF Analytics does not (but referrer data is available)

### Manual log

- If anyone reaches out via email, Twitter DM, or Reddit comment asking about Crontinel, log them in a simple spreadsheet or even a note file
- These are your highest-intent leads

### CF Workers logs for failed signups

- Check: Cloudflare Dashboard > Pages > Functions > Logs
- Filter for `Resend env vars not configured` errors
- Each one represents a real person who tried to sign up and got the fallback

---

## TODAY: One Concrete Action (< 30 minutes)

**Current status: the silent fake-success issue is already fixed.**

What is live now:
- `functions/api/subscribe.ts` returns `503` with `error: 'unavailable'` when Resend env vars are missing
- `src/pages/index.astro` detects that state and shows an honest fallback message pointing users to `https://x.com/crontinel`

### Best next upgrade

If you want real lead capture before Resend is wired, the clean next step is still to add a Tally.so fallback.

### Minutes 0-5: Create a Tally.so form

1. Go to tally.so, create a free account
2. Create a form with one field: "Email" (type: email, required)
3. Set the form title to "Crontinel Waitlist"
4. Set the thank-you message to: "You're on the list. We'll reach out when Crontinel launches."
5. Publish the form and copy the URL (e.g. `https://tally.so/r/xxxxxx`)

### Minutes 5-15: Replace the X fallback with a real capture link

In `src/pages/index.astro`, keep the same unavailable-state branch but swap the message to:

```ts
msg.innerHTML = 'Signup is temporarily unavailable. <a href="https://tally.so/r/XXXXX" target="_blank" rel="noopener" class="underline">Join via our waitlist form</a> instead.';
msg.className = 'mt-3 text-sm text-yellow-400';
btn.disabled = false;
btn.textContent = 'Get early access';
```

### Minutes 15-25: Deploy and verify

1. Commit the change
2. Push to trigger CF Pages deployment
3. Test: submit an email on crontinel.com, confirm you see the yellow fallback message with Tally link
4. Click the Tally link, submit an email there, confirm it appears in Tally dashboard

Once Resend keys are configured later, the 503 path stops firing and the form works natively. The Tally link becomes dormant fallback code that only activates again if keys are ever removed.
