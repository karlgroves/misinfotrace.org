# Spec: Support page (`/support/`)

Status: draft for review — 2026-09-11

## Purpose

A page people can be sent to when they ask how to support Misinfo Trace
financially. It explains the project's financial position honestly and routes
every inquiry to a conversation. It does not take payments.

The page must let a visitor answer, before they write to us:

1. What does the project cost to run, and what would more money let it do?
2. Who would actually receive the money, and is it tax-deductible?
3. Where does the money go? (Operations and infrastructure — not salaries.)
4. Is Misinfo Trace a 501(c)(3)? (Not yet. It intends to become one.)
5. Does funding buy influence over the research? (No.)

It must stay consistent with the site's stance: fundraising is secondary to the
research mission (see [the MVP scope](../mvp-landing-page-scope.md)), and every
claim on the page must be true when published.

## Why a contact page, not a donate button

- Misinfo Trace is not yet a legal entity, so a donation today goes to a person
  or another organization on the project's behalf. Donors should hear that, and
  ask questions, before any money moves.
- It keeps payment processing, refunds, receipts and card data out of scope.
- It lets institutional funders, in-kind offers (compute, hosting credits) and
  individual donors all use one route.

A payment link can be added later, once the decisions below are settled.

## Grounding: what the project actually pays for

From the research repository (`misinfo-trace`), current as of this draft:

| Cost | What it is | Source |
| --- | --- | --- |
| Collection server | One DigitalOcean Droplet running the collectors and PostgreSQL, with an attached block-storage volume | `infrastructure/digitalocean/README.md`, spec §28 |
| Off-server backups | DigitalOcean Spaces; a daily off-server backup is required so the collected corpus is never held in one place | spec §28.2 |
| AI model usage | One structured classification call per eligible observation; the pipeline records measured token cost | spec §29.2–29.3 |
| Website | Netlify hosting and the `misinfotrace.org` domain | this repository |

The research spec's planning targets (§29.1) are about **$50–$150 a month for
infrastructure** and **$150–$750 a month total technical cost** during the
prospective test phase, excluding labor. These are targets, not measured
spending. The page must publish **actual** figures, dated — the targets may be
quoted only if labeled as a planned budget.

## Page content

Voice and components follow the existing site: eyebrow, `page-title`, `lede`,
`prose` sections, the existing form and button styles. No new visual
components are needed. Copy below is draft; bracketed values are placeholders
that `npm run check:launch` will refuse to publish.

### Header

- Eyebrow: **Support**
- Title: **Help keep the research running.**
- Lede: Misinfo Trace runs on volunteered time and a small infrastructure
  budget. If you'd like to help cover it, get in touch — we'll talk it through
  with you before any money changes hands.

### 1. Where the project stands

> Misinfo Trace is an independent research project. It is **not yet a
> registered nonprofit** and **not a 501(c)(3) organization**, so donations are
> **not tax-deductible**.
>
> Until a nonprofit exists, support is received by [RECIPIENT LEGAL NAME] on
> the project's behalf.

The non-deductibility statement must be prominent — not in a footnote — and
repeated next to the form.

### 2. What it costs

A table of actual monthly running costs, dated:

| Item | Monthly cost |
| --- | --- |
| Collection server and storage (DigitalOcean) | [SERVER COST] |
| Off-server backups (DigitalOcean Spaces) | [BACKUP COST] |
| AI model usage for classifying claims | [MODEL COST] (varies with volume) |
| Website hosting and domain | [WEBSITE COST] |
| **Total** | **[MONTHLY TOTAL]** |

Caption: "Actual spending for [MONTH YEAR]." Update the figures and date at
least as often as the spending summary (section 4).

Implementation note: a real `<table>` with a caption and `scope="col"` /
`scope="row"` headers, reusing the `.compare` table styles.

### 3. What more funding would do

Three goals, in priority order, each with an amount and what it buys:

1. **Keep the lights on.** Cover running costs for [MONTHS] months:
   [RUNNING COSTS GOAL].
2. **Run the early-warning test in full.** The model usage and storage the
   prospective test phase needs: [TEST PHASE GOAL].
3. **Form the nonprofit.** Legal and filing costs to incorporate and apply for
   501(c)(3) status: [NONPROFIT FORMATION GOAL].

No progress bar or "raised so far" figure at launch: it needs a maintained data
source, and a stale number is worse than none.

### 4. Where the money goes

> Every dollar goes to operations and infrastructure — servers, storage,
> backups, AI model usage, the website, and [OTHER OPERATING COSTS]. **None of
> it goes to salaries.** No one working on Misinfo Trace is paid.
>
> If that changes, this page will say so before we accept money on the new
> basis.
>
> We publish a summary of what we spend every [REPORTING PERIOD].

The word "yet" belongs in the heading or lede, not buried: the project may pay
people in future, and donors should know that is possible.

### 5. Becoming a 501(c)(3)

> We intend to form a nonprofit and apply for 501(c)(3) status once the current
> research phase shows the approach works. We have not applied yet, and we
> can't promise when — or whether — that status will be granted.
>
> Money given before the nonprofit exists is not tax-deductible, and it won't
> become deductible if the nonprofit is approved later.

This mirrors the research spec: the nonprofit model is the intended direction
**if** the proof of concept succeeds (§4.8), and forming the organization comes
after it (§56.1, §57). Do not state a date unless one is decided.

### 6. Independence

> Support doesn't buy influence. Funders have no say in what we study, how we
> assess claims, or what we publish, and the same methodology applies no matter
> who funds the work.
>
> [FUNDING ACCEPTANCE POLICY]
>
> [FUNDER DISCLOSURE POLICY]

For a project whose credibility rests on political neutrality, "who funds you?"
is the first question critics will ask. The two policies are decisions for
Karl (see below); the page should not launch without them.

### 7. Contact form

Heading: **Tell us about the support you have in mind.**

Netlify form `support`, same pattern as `contact` (hidden `form-name`, honeypot
`company`, `action` to a confirmation page):

| Field | Control | Required |
| --- | --- | --- |
| Name | text, `autocomplete="name"` | yes |
| Email address | email, `autocomplete="email"` | yes |
| Organization | text, `autocomplete="organization"` | no — marked "(optional)" |
| Kind of support | radio group in a `<fieldset>` with `<legend>`: a personal donation / funding from an organization or foundation / donated infrastructure or services / something else | yes |
| Message | textarea | yes |

Do **not** ask for an amount or any payment details.

Next to the submit button:

- "Donations are not tax-deductible. See where the project stands." — the last
  four words link to section 1 on the same page.
- "We'll only ever send payment details from [OFFICIAL EMAIL ADDRESS]. If
  anyone else asks you to pay on our behalf, don't." — misinformation
  researchers are an obvious target for impersonation.
- Link to the privacy page.

### Confirmation page (`/support/thanks/`)

`noindex`. Title "Thanks — we'll be in touch." Body: we reply to every support
inquiry, and we'll explain how support works before anything else happens.
Link back to the home page.

## Site integration

- **Footer:** add **Support** (the original brief's footer included it).
- **Get Involved section** on the home page: add a third, visually secondary
  path — "Support the project", one sentence, and a text link "How support
  works" to `/support/`. No button, to keep it below Follow and Contribute.
- **Header:** no change. The header CTA stays "Follow the Research".
- **Privacy page:** add support inquiries to "What we collect" (name, email,
  organization, kind of support, message), state they are used only to respond,
  and update the "last updated" date.
- **MVP scope doc:** remove "donations and fundraising" from the out-of-scope
  list and describe this page instead.
- **Sitemap:** `/support/` listed; `/support/thanks/` excluded (`noindex`).

## Technical requirements

- Nunjucks page at `src/support.njk`; confirmation at `src/support-thanks.njk`
  with `permalink: /support/thanks/`.
- No new JavaScript. No new colors unless added to
  `scripts/check-contrast.mjs` first. No `style` attributes (CSP).
- The radio group must pass the site's form checks: every radio has its own
  `<label for>`, and the group has a `<legend>`.
- Add `/support/` and `/support/thanks/` to the `PAGES` list in
  `e2e/site.spec.js`, so both get the a11y-assert audit, the CSP console check
  and the phone-width reflow check.
- `npm run check:site` covers the new form automatically (Netlify attributes,
  honeypot, labels, action target).

## Decisions needed before launch

These are Karl's to make; several need a lawyer or accountant, not a developer.

1. **Who receives the money.** Karl personally, AFixt, or a **fiscal sponsor**
   (an existing 501(c)(3) that accepts funds for the project, usually for a
   fee). A fiscal sponsor would make donations tax-deductible now and changes
   sections 1 and 5 substantially — decide this first.
2. **Tax and legal review.** How funds received before incorporation are taxed
   for the recipient, and whether soliciting them requires registration under
   state charitable-solicitation laws. The page must not launch before this.
3. **Actual monthly costs** for the section 2 table, with the month they cover.
4. **Goal amounts** for section 3, and whether donations may pay for
   incorporation and 501(c)(3) filing costs (section 3, goal 3; section 4
   "operations").
5. **Spending summary:** how often, and where it is published.
6. **Funding acceptance policy:** sources the project will not accept money
   from (for example political parties, campaigns and PACs, or organizations
   the research may examine).
7. **Funder disclosure policy:** which funders are named publicly, and above
   what amount.
8. **Official email address** that payment details will come from.
9. **Future salaries:** confirm the "not yet" framing, and what notice donors
   get if that changes.

## Out of scope

- Payment processing, donate buttons, recurring gifts.
- Donor accounts, a donor wall, a fundraising progress bar.
- Receipts. (Nothing is deductible yet; revisit with the nonprofit or a fiscal
  sponsor.)

## Acceptance criteria

- [ ] `/support/` answers the five questions under Purpose without the visitor
      contacting anyone.
- [ ] "Not a 501(c)(3)" and "not tax-deductible" appear in section 1 and again
      beside the form.
- [ ] The recipient of funds is named.
- [ ] Section 2 shows actual, dated costs; any planning target is labeled as one.
- [ ] Section 4 states that no money goes to salaries, and says what happens if
      that changes.
- [ ] The `support` form works through Netlify Forms, asks for no amount or
      payment details, and lands on `/support/thanks/`.
- [ ] Footer and Get Involved link to the page; the header is unchanged.
- [ ] The privacy page covers support inquiries.
- [ ] `npm run check` passes with both pages in the browser tests.
- [ ] `npm run check:launch` passes: no bracketed placeholders remain.
- [ ] Legal/tax review (decision 2) is complete and recorded.
