# AI Influencer Playbook

A complete build: identity, personality, content engine, monetization, and automation workflow — with disclosure requirements built into every layer, since Instagram, TikTok, and the FTC now require both AI-content labeling and sponsorship disclosure.

---

## Step 1: Face & Identity Reference Sheet

This is a written spec to feed into whatever image-generation tool you're using (Midjourney, SDXL, etc.) to lock a consistent identity before generating any content.

**Name:** _[placeholder — pick something that isn't a real public figure's name]_

**Core facial structure**
- Oval face shape, medium-high cheekbones, soft jawline
- Almond-shaped eyes, medium-warm brown
- Straight nose with slight natural bridge
- Full lips, natural resting expression (not a fixed "smile lock")

**Signature identifiers (repeat in every prompt to anchor consistency)**
- A single faint freckle just under the left eye
- Slight asymmetry: right eyebrow arches marginally higher than left
- A small beauty mark near the jawline, right side

**Texture & realism cues**
- Visible skin pores, especially across the nose and forehead
- Subtle under-eye texture, no airbrushed smoothing
- Individual flyaway hair strands, not a "helmet" hairline
- Natural asymmetric parting

**Hair:** _[pick and lock: length, color, texture]_ — describe it the same way in every prompt.

**Reference sheet generation order**
1. Front view, neutral lighting, neutral expression
2. Left three-quarter profile
3. Right three-quarter profile
4. Full side profile
5. Close-up crop on eyes/nose/mouth for texture reference

**Consistency technique**
- Save the front-view output as your locked reference image and use image-to-image or a character-reference/seed feature (depending on your tool) for every subsequent generation, rather than re-describing her from scratch each time.
- Keep a "identity card" text file with the exact wording above — reuse it verbatim across prompts so wording drift doesn't shift the face.
- Vary only outfit, lighting, and background per post; never vary the face-anchor language.

**Mandatory label:** Every account bio and every post caption should carry a persistent, unmissable label that this is an AI-generated persona (e.g., "AI-generated character" in bio, plus platform-native AI-content tags on each post — see Step 4 for the disclosure system).

---

## Step 2: Personality & Voice Profile

**Niche:** _[pick one lane to start — e.g., wellness/lifestyle, budget fashion, productivity/tech, travel-on-a-budget]_ — broad "lifestyle" accounts underperform vs. accounts with a clear niche.

**Tone of voice:** Warm, a little dry-witted, talks *to* the viewer not *at* them. Uses casual phrasing, contractions, short sentences in captions. Avoids corporate-speak.

**Interests:** 3–5 specific, recurring interests that show up across content (not generic "loves coffee and travel" — pick things specific enough to build running bits around).

**Aesthetic:** _[e.g., clean modern-minimal, warm film-grain, high-contrast editorial]_ — lock a consistent color grade and caption font style so the feed reads as one visual brand.

**Target audience:** Define age range, what problem/desire she speaks to, and what platform behavior they have (scroll-and-save vs. comment-heavy, etc.)

**Three humanizing flaws/quirks** (pick or adapt):
1. Overly attached to a mundane habit (over-orders the same coffee, rewatches the same show)
2. A mild, self-deprecating insecurity she jokes about openly
3. A "hot take" she holds that's mildly controversial but harmless (e.g., an unpopular food opinion)

**Content style:** Mix of polished and intentionally "lo-fi" posts — perfection reads as inauthentic; the flaws above should show up in captions and stories, not just be lore.

**Emotional positioning:** Built for trust and return visits — she should feel like "the friend who always has good recs," not a billboard.

---

## Step 3: 30-Day Content Calendar (Framework)

Rather than fabricate 30 fictional dated posts, here's the reusable weekly structure — plug in your actual niche topics:

| Day type | Format | Purpose |
|---|---|---|
| Mon | Talking head, direct-to-camera opinion/hot take | Engagement (comments) |
| Tue | Voiceover + B-roll "day in the life" | Relatability, saves |
| Wed | Text-on-screen story format (mini narrative) | Shares |
| Thu | POV format | Novelty, reach |
| Fri | Reaction-style (reacting to a trend/news in the niche) | Timeliness, comments |
| Sat | Relatable meme/moment post | Shares, low-effort high-reach |
| Sun | Engagement question / poll-style caption | Comments, algorithm signal |

**Viral hook formulas to rotate:**
- "Nobody tells you this about ___"
- "I used to think ___, until ___"
- "POV: you just found out ___"
- "Things I wish I knew before ___"
- "Unpopular opinion: ___"

**Caption structure:** Hook line → 1–2 sentences of substance → engagement question → hashtags (mix of niche-specific + broad reach tags, 5–8 total, not 30).

**Replay/save value:** At least one post per week should be "reference" style content (a list, a step-by-step, a comparison) — these get saved and resurfaced by the algorithm longer than pure entertainment posts.

**Labeling requirement:** Each video description/caption includes the platform's AI-generated content disclosure (Instagram and TikTok both have a native toggle for this — use it every time, not just when convenient).

---

## Step 4: Revenue Stack & Monetization Plan

**Phase 1 — Build trust (Months 1–2):** No monetization. Pure value/entertainment content only. Goal: establish a consistent posting cadence and real engagement rate before introducing any commercial angle.

**Phase 2 — Layer in affiliate (Months 2–4):**
- Amazon/LTK-style affiliate links for products she'd "actually use" tied to the niche
- Only recommend things consistent with her established interests — inconsistent promos are the #1 trust-killer for niche accounts
- Disclose every affiliate link with "#ad" or "#affiliate" in the caption, not buried

**Phase 3 — Inbound brand interest (Months 3–6):**
- Once engagement rate is solid (aim for niche-benchmark, not vanity follower count), build a one-page media kit: audience demographics, engagement rate, past content examples, and **explicit disclosure that the account is an AI-generated persona** — brands need this to manage their own compliance risk.
- Brand outreach script (for *you* reaching out, not fabricated as her own voice):
  > "Hi [Brand], I run [Account], an AI-generated content persona focused on [niche] with [X]% engagement across [platforms]. I'd love to explore a sponsored placement — happy to share our media kit and past brand content examples."

**Phase 4 — Recurring income (Month 6+):**
- Digital product (template pack, guide, preset pack — tied to niche)
- Possible Patreon/subscription tier for "behind the scenes" or extended content
- Diversify: aim for no single revenue source to be more than ~50% of total income

**Disclosure checklist (non-negotiable, every phase):**
- [ ] Bio states persona is AI-generated
- [ ] Every sponsored post uses platform paid-partnership tools + #ad
- [ ] Every AI-generated video/image uses the platform's AI-label feature
- [ ] Media kit sent to brands discloses AI-generated status upfront

---

## Step 5: Automation Workflow

A realistic hands-off pipeline (built for tools like n8n/Zapier/Make, or a simple internal dashboard):

**Daily automation:**
1. **Idea generation** — feed niche + trending-topic sources into a script-writing pass (topic → hook → 3 content angles)
2. **Script draft** — turn selected angle into a full script + shot list
3. **Asset generation** — image/video generation pass using the locked identity reference from Step 1
4. **Caption + hashtag generation** — pull from the Step 3 caption formula
5. **Human review checkpoint** — **do not fully skip this.** A human should approve final copy and check the disclosure labels are present before anything goes out. This is both a quality gate and a compliance gate.
6. **Scheduling** — push to a scheduler (Later, Buffer, native schedulers) across platforms

**Weekly review loop:**
- Pull performance data (views, saves, shares, comment rate) per format
- Rank formats by performance
- Drop the bottom-performing format for the next week; double the content volume on the top performer
- Re-check: is engagement *quality* (comments, saves) declining even if reach is up? That's usually the first sign of audience fatigue — a cue to introduce a new format rather than push harder on the winning one.

**Guardrail to keep in the workflow, not cut for speed:** the human review checkpoint above. Fully unattended posting is where disclosure labels get skipped and where off-brand or out-of-character content slips through — both are the fastest ways to lose an account's trust or get flagged by a platform.

---

*Note: This is a planning framework, not legal advice — FTC and platform disclosure rules vary and change, so check current guidance (ftc.gov and each platform's ad-policy pages) before publishing sponsored or AI-generated content at scale.*
