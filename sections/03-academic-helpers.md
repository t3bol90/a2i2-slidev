---
layout: section
number: 5
title: Animations & Tooling
subtitle: Step-by-step diagrams with v-switch, draft-mode Todo helper
---

---
layout: default
---

# Step-by-step diagram (v-switch)

Three frames revealed on successive clicks — PDF export produces one page per frame.
No wrapper component; authors write `<template #N>` directly inside `<v-switch>`.

<v-switch>

<template #1>
<div style="width:100%;height:220px;background:var(--a2i2-primary-light);border-radius:6px;display:flex;align-items:center;justify-content:center;gap:2.5rem;">
  <div style="padding:0.6rem 1.4rem;background:var(--a2i2-primary);color:#fff;border-radius:6px;font-weight:700;font-size:1.1rem;">X</div>
</div>
</template>

<template #2>
<div style="width:100%;height:220px;background:var(--a2i2-primary-light);border-radius:6px;display:flex;align-items:center;justify-content:center;gap:2.5rem;">
  <div style="padding:0.6rem 1.4rem;background:var(--a2i2-primary);color:#fff;border-radius:6px;font-weight:700;font-size:1.1rem;">X</div>
  <span style="font-size:1.4rem;color:var(--a2i2-secondary);">→</span>
  <div style="padding:0.6rem 1.4rem;background:var(--a2i2-primary);color:#fff;border-radius:6px;font-weight:700;font-size:1.1rem;">Z</div>
</div>
</template>

<template #3>
<div style="width:100%;height:220px;background:var(--a2i2-primary-light);border-radius:6px;display:flex;align-items:center;justify-content:center;gap:2.5rem;">
  <div style="padding:0.6rem 1.4rem;background:var(--a2i2-primary);color:#fff;border-radius:6px;font-weight:700;font-size:1.1rem;">X</div>
  <span style="font-size:1.4rem;color:var(--a2i2-secondary);">→</span>
  <div style="padding:0.6rem 1.4rem;background:var(--a2i2-primary);color:#fff;border-radius:6px;font-weight:700;font-size:1.1rem;">Z</div>
  <span style="font-size:1.4rem;color:var(--a2i2-secondary);">→</span>
  <div style="padding:0.6rem 1.4rem;background:var(--a2i2-secondary);color:#fff;border-radius:6px;font-weight:700;font-size:1.1rem;">Y</div>
</div>
</template>

</v-switch>

---
layout: default
---

# Draft-mode Todo helper

`<Todo>` is visible in `pnpm dev` (or when `SLIDEV_DRAFT=1` is set). In a
production build it renders nothing — not even an empty `<span>`.

<Todo>

TODO: replace the placeholder frames above with the real steering-intervention
figure once `public/figures/05-extras/steer.svg` is ready.

</Todo>

Body text is always rendered. Authors can annotate slides during deck preparation
without those notes appearing in the distributed PDF.

---
layout: section
number: 6
title: Code & Syntax
subtitle: Custom A²I² Shiki theme, line numbers, and Magic Move
---

---
layout: default
---

# Syntax highlighting — A²I² theme

Language tag top-right, line numbers in gutter, copy button on hover.
All token colors pass **WCAG AA** (≥ 4.5 : 1) on white; no red–green pairings.

```python {lines: true}
import torch
from typing import Optional


@torch.no_grad()
def extract_steering_vectors(
    model: torch.nn.Module,
    pairs: list[tuple[str, str]],
    layer: int = 14,
) -> torch.Tensor:
    # Collect contrastive activations at the chosen residual-stream layer
    pos_acts: list[torch.Tensor] = []
    neg_acts: list[torch.Tensor] = []
    for pos_prompt, neg_prompt in pairs:
        h_pos = get_hidden(model, pos_prompt, layer)   # [d_model]
        h_neg = get_hidden(model, neg_prompt, layer)   # [d_model]
        pos_acts.append(h_pos)
        neg_acts.append(h_neg)

    # Representation-engineering: top PCA direction of contrastive diffs
    diffs = torch.stack(pos_acts) - torch.stack(neg_acts)
    U, _, _ = torch.linalg.svd(diffs, full_matrices=False)
    return U[:, 0]          # principal steering direction
```

---
layout: default
---

# Magic Move — adding a sparsity mask

Click to animate the transition from a plain steering injection to a
sparse version that only modifies the most-active dimensions.

````md magic-move
```python
def steer(
    h: torch.Tensor,
    delta: torch.Tensor,
) -> torch.Tensor:
    """Apply a steering vector to the residual stream."""
    return h + delta
```

```python
def steer(
    h: torch.Tensor,
    delta: torch.Tensor,
    alpha: float = 1.0,
) -> torch.Tensor:
    """Apply a sparse steering vector to the residual stream."""
    # Keep only the top-50% most-active dimensions
    threshold = h.abs().median()
    mask = (h.abs() > threshold).float()
    return h + alpha * delta * mask
```
````
