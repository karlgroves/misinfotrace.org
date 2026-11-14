## MVP Landing Page Scope

The initial release should be a focused, credible project landing page, not a complete misinformation-analysis platform.

The purpose of the MVP is to establish the project's public identity, clearly explain its mission and research approach, demonstrate its commitment to methodological neutrality and transparency, and provide visitors with ways to follow or get involved in the work.

Many capabilities described elsewhere in this brief represent the future product and research vision. They should influence the design system and information architecture, but they are not requirements for the initial landing page.

### MVP Goals

The MVP must answer five questions quickly:

1. What is Misinfo Trace?
2. What problem is the project trying to solve?
3. How is its approach different from conventional fact-checking?
4. How will it guard against political or ideological bias?
5. How can someone follow or get involved in the project?

A visitor should not need to understand the underlying technical architecture, research datasets, or future analysis tools to understand the project.

### MVP Page Sections

The initial landing page should contain the following sections.

#### 1. Header

Include:

- project name/logo;
- About;
- Approach;
- Research;
- Get Involved;
- Follow the Research CTA.

Navigation may initially use anchor links to sections of the landing page rather than requiring separate pages.

#### 2. Hero

**Eyebrow:** AN OPEN RESEARCH PROJECT

**Headline:**

> Misinformation is a system.
> We're studying how it works.

Supporting copy should explain that the project detects factual narratives as they emerge, examines the evidence surrounding them, and ultimately studies how misinformation originates and spreads.

- **Primary CTA:** Explore the Project
- **Secondary CTA:** See Our Approach

The MVP does not require an operational network visualization. A lightweight static or subtly animated visualization may communicate the concept:

`Claim → Source → Amplification → Network → Audience`

#### 3. The Problem

Explain that misinformation should not be understood solely as isolated false statements.

Introduce the concept that claims can originate somewhere, propagate through different channels, become part of larger narratives, and potentially involve recurring sources and amplifiers.

Cover the three forms the project is concerned with:

- **Emerging** — a factual narrative that is beginning to spread before evidence or correction has caught up with it.
- **Persistent** — a narrative that has already been checked or corrected but keeps resurfacing and reaching new audiences.
- **Context-distorting** — a narrative built on a statement that may be accurate, but that misleads because important context is left out.

Use the simple visual:

`CLAIM → SOURCE → AMPLIFICATION → NETWORK → IMPACT`

This section should establish the rationale for the project without requiring any live data.

#### 4. What We're Building

Present the three-part model:

- **IDENTIFY** — Detect factual claims and narratives worth investigating, including the same claim expressed in different words, before judging whether they are true.
- **INVESTIGATE** — Determine what available evidence supports or contradicts those claims.
- **TRACE** — Study where misinformation originates, how it spreads, and whether recurring patterns emerge.

This section must also answer how the approach differs from conventional fact-checking. Fact-checking typically begins with a claim someone has already chosen to check, often after it has spread widely. Misinfo Trace aims to find narratives while they are still emerging, recognize them across different wording, notice when debunked narratives resurface, and route them to human verification. Detection comes before judgment.

Clearly identify this as the project's research direction rather than implying that every capability already exists.

#### 5. How It Works

Present a simplified version of the methodology:

`Observe → Classify → Investigate → Evaluate → Trace → Connect → Publish`

Each step should have a short explanation.

The **Evaluate** explanation must not imply the project issues simple true/false verdicts. Evaluation produces a structured, evidence-based assessment that records supporting and contradicting evidence and its confidence, and it can legitimately conclude that the answer is unknown. No single AI model decides whether a claim is true, and consequential conclusions remain human-reviewable.

For the MVP, this is explanatory content only. No automated claim-analysis interface is required.

#### 6. Same Standard, Regardless of Side

This is a required MVP section because methodological neutrality is central to the credibility of the project.

**Headline:** Same claim. Same evidence. Same standard.

Explain that the project's goal is to apply the same public-interest, classification, and evidentiary standards regardless of the political or ideological implications of a claim.

Include a simple mirrored visualization:

```text
Position A → Same Methodology ┐
                              ├→ Evidence-Based Assessment
Position B → Same Methodology ┘
```

The endpoint should read as an assessment, not a verdict. Where space allows, note that "unknown" is a valid outcome.

Include the link: **See how we're testing for bias →**

This link can point to a short methodology explanation of the project's scope-bias testing: matched pairs of claims that differ only in which side, country, or institution they favor, checked to confirm the scope rules treat them the same. A complete study is not required at launch. Any figures quoted must carry the caveats the research itself states. For example, results on constructed test examples must not be presented as results on real-world content.

#### 7. Research Principles

Include the six principles:

- Evidence over authority
- Transparency over trust
- Consistency over ideology
- Uncertainty over false certainty
- Correction over defensiveness
- Investigation over accusation

Keep this section concise.

#### 8. What This Project Is Not

Include the most important distinctions:

- **Not a system for policing opinions.** It evaluates factual claims.
- **Not a partisan fact-checking project.** The same methodology should apply regardless of viewpoint.
- **Not an automated truth machine.** No single AI model decides whether a claim is true. Consequential conclusions are human-reviewable.
- **Not an authority asking people to accept its conclusions.** Evidence and methodology should be inspectable.
- **Not a system for labeling someone a bad actor because they were wrong.** Intent and coordination require additional evidence.

This section should directly address the most predictable concerns about the project.

#### 9. Current Research

The MVP should show that this is an active research project rather than merely an idea, without overstating what it has produced.

Initially include approximately four to six research areas, such as:

- **Early Warning** — Testing whether emerging factual narratives can be detected before they are widely recognized, including the same claim expressed in different words. *Researching*
- **Defining the Boundary** — Determining which kinds of content should qualify for misinformation analysis. *Testing*
- **Testing for Bias** — Testing whether opposed claims receive equivalent treatment under the methodology. *Testing*
- **Persistent Narratives** — Finding already-debunked narratives that keep resurfacing, and tracing where they reappear. *Planned*
- **Evaluating Claims** — Developing repeatable methods for comparing factual claims against available evidence. *Planned*
- **Tracing Provenance and Networks** — Investigating where claims originate, and how recurring sources and amplification relationships can reveal larger patterns. *Planned*

Each should be labeled appropriately: **Researching**, **Testing**, or **Planned**. The statuses above are suggested starting points and must be confirmed against the actual state of the research at launch.

Do not imply that planned capabilities already exist, and do not imply the project has published findings about specific misinformation unless it has.

#### 10. Get Involved

The final major section should provide clear participation paths:

- **Follow the Research** — Subscribe to project updates.
- **Contribute** — Provide a route for researchers, technologists, journalists, or others interested in collaboration.

The MVP does not include a donation or fundraising path. Design this section so a Support path can be added later without restructuring the page.

#### 11. Footer

The MVP footer should include:

- About
- Methodology
- Research
- Get Involved
- Privacy
- Contact

Include the positioning statement:

> Misinfo Trace — Evidence before conclusions.

### MVP Functional Requirements

The MVP requires only a small amount of application functionality.

**Required:**

- responsive navigation;
- anchor navigation or basic internal pages;
- newsletter/email signup;
- contact/collaboration mechanism;
- basic analytics;
- accessible responsive design;
- SEO metadata;
- social-sharing metadata;
- privacy controls appropriate to deployed analytics;
- reduced-motion handling.

**Optional:**

- subtle hero animation;
- static network visualization;
- research-status cards;
- lightweight scroll effects.

The MVP should work completely without animation or advanced JavaScript.

### Explicitly Out of MVP Scope

The following should not be required to launch the landing page:

- payment processing and donate buttons (donation inquiries go through the Support page — see [specs/support-page.md](specs/support-page.md));
- live misinformation monitoring;
- automated claim detection;
- automated fact checking;
- AI-generated verdicts;
- public claim submission and processing;
- searchable claim database;
- live source database;
- bad-actor profiles;
- organization profiles;
- social-account profiles;
- interactive misinformation network explorer;
- live network analysis;
- automated provenance tracing;
- public narrative-clustering interface;
- account coordination detection;
- public APIs;
- user accounts;
- research dashboards;
- researcher workspaces;
- crowdsourced voting;
- community moderation;
- real-time social-media ingestion;
- large-scale data visualization.

These belong to later product phases. Some of them, such as narrative clustering, are active research behind the scenes. They appear on the MVP site only as research-area cards, never as working features.

### MVP Content Requirements

The MVP can therefore launch with approximately:

- one landing page;
- one concise methodology/approach page;
- one research page or research section;
- one About section/page;
- one Get Involved/contact mechanism;
- one email subscription mechanism;
- privacy/legal pages as necessary.

If the methodology and research content is sufficiently concise, the public-facing MVP could initially be almost entirely a single-page website with supporting Privacy and other required legal pages.

### MVP Data Requirements

The MVP should not depend on having a large misinformation dataset.

At launch, it needs only enough real research material to demonstrate that the project has a defined methodology and active research program. Every research claim on the page must match what the research has actually produced at launch.

Where demonstrations are necessary, they must be clearly labeled — **Demonstration**, **Example**, **Prototype**, or **Illustrative Data**.

Synthetic or illustrative information must never appear to represent actual research findings.

### MVP Design Constraint

The visual design should anticipate the eventual research platform without attempting to build it prematurely.

Reusable components should therefore be designed for future concepts such as:

- claims;
- sources;
- evidence;
- classifications;
- confidence;
- research studies;
- narratives;
- actors;
- relationships.

However, the MVP should use those concepts primarily as visual language, not as fully functional application features.

### MVP Success Criteria

The MVP succeeds if a first-time visitor can accurately explain the project after viewing the page.

The visitor should understand:

> Misinfo Trace is an independent research project testing whether emerging and resurfacing factual narratives can be detected early and consistently, so they can be investigated against inspectable evidence — and, ultimately, studying how misinformation originates and spreads through larger networks.

They should also understand:

> The project is explicitly testing its own methods for political or ideological bias rather than simply claiming neutrality.

And:

> The project intends to make its methodology and evidence inspectable so conclusions can be independently challenged and verified.

From a conversion perspective, the page should successfully drive at least one of three actions:

1. Follow the research
2. Examine the methodology
3. Get involved

Everything else is secondary for the MVP.

### MVP vs. Future Vision

The design team should maintain a clear distinction between what the website is at launch and what the project intends to become.

#### MVP

`Explain → Establish credibility → Show methodology → Present research → Build audience → Attract collaborators`

#### Later Research Platform

`Collect → Detect → Investigate → Evaluate → Trace → Connect → Analyze → Publish`

This distinction should prevent the MVP from becoming an unnecessarily large software project while still allowing the landing page to communicate the much larger ambition behind Misinfo Trace.
