---
layout: section
number: 3
title: Bibliography
subtitle: Deck-global citations with left-aligned footnotes
---

---
layout: default
---

# Citations + Footnotes

Inline superscripts reference global bibliography entries.
Two unique cites: Proximal Policy Optimization<Cite k="schulman2017proximal" /> and OpenAI Gym<Cite k="brockman2016openai" />.
Repeating the first cite reuses its number: PPO again<Cite k="schulman2017proximal" />.

Footnotes render automatically at the bottom of every slide — no `<Footnotes />` needed.
Same key always maps to the same number across all slides (bib-file order).

---
layout: section
number: 4
title: Layout Gallery
subtitle: figure, figure-side, two-col, quote, section-toc, closing
---

---
layout: section-toc
---

---
layout: figure
caption: "Figure 4.1 — Steering intervention shifts the residual stream away from the undesired output region."
attr: "Adapted from conceptual diagrams in representation engineering literature."
---

<div style="width:100%;height:260px;background:var(--a2i2-primary-light);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--a2i2-secondary);font-size:0.9rem;opacity:0.6;">
  figure placeholder — replace with an SVG or PNG in <code>public/figures/</code>
</div>

---
layout: figure-side
captionLeft: "Baseline (no intervention)"
captionRight: "Steered ($\\alpha = 1.5$)"
caption: "Activation differences before and after applying the steering vector."
---

::left::
<div style="width:100%;height:200px;background:var(--a2i2-primary-light);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--a2i2-secondary);font-size:0.85rem;opacity:0.6;">
  (a) left figure placeholder
</div>

::right::
<div style="width:100%;height:200px;background:var(--a2i2-primary-light);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--a2i2-secondary);font-size:0.85rem;opacity:0.6;">
  (b) right figure placeholder
</div>

---
layout: two-col
cols: "1fr 1fr"
---

::left::
## Prompt-level steering

- Modifies the **input context** only
- No weight updates required
- Zero additional parameters
- Inference-time control

::right::
## Representation engineering

- Injects steering vectors into **residual stream**
- Works at arbitrary layers
- Requires intervention design
- More precise directional control

---
layout: quote
attribution: "— Reviewer 2, NeurIPS 2025"
---

"The proposed method demonstrates clear causal interpretability, yet the authors should address scalability concerns for models beyond 7B parameters."

---
layout: default
---

# BookTable — markdown table

<BookTable caption="Table 4.2 — Policy gradient methods on continuous control (1 M steps, 5 seeds)." footnote="Higher is better. Best score per column in bold.">

| Method | HalfCheetah | Hopper | Ant |
|--------|:-----------:|:------:|:---:|
| PPO | $4{,}102$ | $2{,}981$ | $3{,}456$ |
| DDPG | $8{,}577$ | $2{,}107$ | $4{,}839$ |
| SAC | $\mathbf{11{,}245}$ | $\mathbf{3{,}502}$ | $\mathbf{6{,}291}$ |

</BookTable>

A vanilla Markdown table **outside** `<BookTable>` keeps Slidev default styling:

| A | B | C |
|---|---|---|
| 1 | 2 | 3 |

---
layout: default
---

# BookTable — spanning-header table

<BookTable caption="Table 4.3 — Ablation: steering-vector intervention layer vs. causal effect size." footnote="NDE = natural direct effect; NIE = natural indirect effect. Higher = stronger causal effect. Best results bolded.">

<table>
<thead>
<tr>
  <th rowspan="2">Layer group</th>
  <th colspan="2">GPT-2 (117 M)</th>
  <th colspan="2">Llama-2 7B</th>
</tr>
<tr>
  <th>NDE</th><th>NIE</th>
  <th>NDE</th><th>NIE</th>
</tr>
</thead>
<tbody>
<tr><td>Early (1–4)</td><td>0.12</td><td>0.08</td><td>0.09</td><td>0.06</td></tr>
<tr><td>Mid (5–8)</td><td><strong>0.31</strong></td><td><strong>0.27</strong></td><td><strong>0.28</strong></td><td><strong>0.24</strong></td></tr>
<tr><td>Late (9–12)</td><td>0.18</td><td>0.14</td><td>0.22</td><td>0.19</td></tr>
</tbody>
</table>

</BookTable>
