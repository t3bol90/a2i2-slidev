---
layout: section
number: 1
title: Foundations
subtitle: Brand tokens, fonts, and the three core layouts
---

---
layout: default
---

# Chrome at a glance

The default layout pins three deck-wide cues so authors never re-style them
slide-by-slide.

- **Top strip** (right-aligned): current section name — sourced from the
  nearest preceding `layout: section` slide's `title` frontmatter.
- **Footer trio**: author · deck title · `N / total`. Author and title come
  from the deck headmatter, so a rebrand or re-attribution is a one-file
  edit.
- **2px progress bar**: pinned to the bottom edge in A²I² primary, width
  proportional to slide position.

Each cue is a CSS-token consumer: `--a2i2-primary` for the rule + progress
bar, `--a2i2-secondary` for chrome type, `--a2i2-bg` for the surface.

---
layout: default
---

# Next iteration

Tracer-bullet S2 is now end-to-end. The foundations land in this order:

1. Brand tokens — `styles/tokens.css` (S2 part 1)
2. Self-hosted Inter + JetBrains Mono — `@fontsource` (S2 part 2)
3. `layouts/title.vue` baseline (S2 part 3)
4. `layouts/section.vue` full-bleed divider (S2 part 4)
5. `layouts/default.vue` chrome — **this slice** (S2 part 5)

Next up: S3 lifts the title layout to a full multi-author API + logo strip.
S4 wires KaTeX with the A²I² math macros. Then theorem engine, BibTeX
pipeline, custom Shiki theme, BookTable, remaining layouts, animations.

---
layout: section
number: 2
title: Theorem Engine
subtitle: Numbered theorems, definitions, and proofs across 8 kinds
---

---
layout: default
---

# Theorem + Proof pair

<Theorem name="Front-Door Identification">

Given the mediation DAG $X \to Z \to Y \leftarrow X$, the interventional distribution satisfies:

$$
p(y \mid \do(x)) = \sum_{z} p(z \mid x) \sum_{x'} p(y \mid x', z)\, p(x')
$$

</Theorem>

<Proof of="2.1">

Apply the law of total probability over the mediator $Z$.
Use $d$-separation to replace $p(z \mid \do(x))$ with $p(z \mid x)$,
then marginalize over $X$ to obtain the outer sum.

</Proof>

---
layout: default
---

# Math vocabulary

Inline math: the steered hidden state is $h' = h + \alpha\, v$, where $v$ is a
direction in $\mathbb{R}^d$ and $\alpha \in \mathbb{R}$.

Display math:

$$
p(y \mid \do(x)) = \sum_{z} p(y \mid x, z)\, p(z)
$$

Aligned multi-line block (front-door identification):

$$
\begin{aligned}
\NIE &= \mathbb{E}\bigl[Y \mid \do(M = m^{*}), X\bigr] - \mathbb{E}\bigl[Y \mid \do(M = m), X\bigr] \\
\NDE &= \mathbb{E}\bigl[Y \mid \do(X = x^{*}), M\bigr] - \mathbb{E}\bigl[Y \mid \do(X = x), M\bigr]
\end{aligned}
$$

Macro use: the lab-standard symbol for the DNN parameterized by $\theta$ is
$\psidnn$, with finite-sample causal/decision estimates $\mfc$, $\mfd$, $\mfae$
and a mean cumulative reward $\meanCumReward$ over $\nep$ episodes.
