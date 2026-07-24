# GIHA: Protagonist Profile

## 2.1 Player Character

**Design philosophy:** Blank slate for player projection, with a shared emotional hook established in the opening cutscene.

### Opening Hook (All Players Share This)

> *Three months ago, you joined GIHA.*
>
> *Your first case was a deepfake that destroyed a journalist's career. The video showed them confessing to crimes they never committed. By the time you traced the fabrication, their reputation was ash.*
>
> *You saved them — barely — but the damage was done. The journalist lost their job, their home, their trust in institutions. You filed the report. You moved on. But you never forgot what a lie can do to a life.*
>
> *Now, Veritas needs you. A new threat. A new fight. A chance to make it right.*

### Character Attributes (Player-Imagined)

| Attribute | Value | Notes |
|-----------|-------|-------|
| **Age** | Mid-20s | Young professional, early career |
| **Role** | Junior AI Forensics Investigator | Competent but still learning |
| **Tenure** | 3 months at GIHA | New enough to be hungry, experienced enough to be capable |
| **Education** | Computer Science / Digital Forensics | Technical background |
| **Personality** | Curious, methodical, empathetic | Player fills in the rest |

### What the Player Knows

- They are good at their job (competence fantasy)
- They have seen what disinfo does (emotional stake)
- They work for an organization with authority but limited resources (underdog energy)
- Veritas is their biggest case yet (rising stakes)

### What the Player Doesn't Need to Know

- Specific gender, appearance, background details
- Family history, romantic life, personal hobbies
- These are left to player imagination

## 2.2 Narrative Voice

The protagonist is **silent** during gameplay (no voice lines), but their presence is felt through:

- **UI interactions:** Clicking, dragging, selecting — the player *is* the investigator
- **Tool usage:** Each forensics tool represents the protagonist's expertise
- **Evidence board:** The player builds the case, reflecting the protagonist's thought process
- **Verdict:** The player's conclusion becomes the protagonist's official report

### Exception: Brief Internal Monologue

At key story beats, **one-line internal thoughts** appear on screen:

| Moment | Monologue |
|--------|-----------|
| First evidence found | *"There it is. The tell."* |
| Connecting evidence | *"This doesn't add up."* |
| Discovering Mira | *"Oh no. She's not a villain. She's a victim."* |
| Final verdict | *"The truth is never simple. But it's always worth finding."* |

## 2.3 The Journalist Callback

The journalist from the protagonist's first case is **Dr. Amara Okafor** — a media studies professor whose career was nearly destroyed by a deepfake.

**Potential integration (optional, not required for MVP):**
- Dr. Okafor could appear as a GIHA analyst providing case context
- Or referenced in debrief text: *"You think of Dr. Okafor. You wonder if she's watching Veritas. You hope she's healing."*

**Educational value:** Reinforces that deepfakes have real human costs.

## 2.4 Player Agency in Story

| Choice Point | Player Options | Narrative Impact |
|--------------|----------------|------------------|
| **Opening briefing** | "I'm ready" / "Tell me more about the target" | Same outcome, different flavor text |
| **Evidence discovery** | Order of evidence examined | Non-linear, all evidence eventually found |
| **Tool selection** | Which tools to use | Affects efficiency score, not story |
| **Verdict** | Real / Manipulated / Uncertain | Major story branch + strategy impact |
| **Mira discovery** | Expose / Report / Ignore | Affects debrief tone, not core outcome |

## 2.5 Design Rationale

| Decision | Rationale |
|----------|-----------|
| Blank slate protagonist | Maximizes player projection across demographics |
| Shared opening hook | Establishes emotional stakes without locking identity |
| Silent protagonist | Avoids voice acting, keeps focus on investigation |
| Internal monologue | Adds personality without breaking immersion |
| Journalist callback | Teaches: disinfo has human costs, investigation matters |

## 2.6 Implementation Notes

- Opening narration: Text cards with ambient audio, ~60 seconds
- Internal monologue: Text overlay, 2-3 seconds, triggered by story events
- No character model needed (first-person investigation perspective)
- Evidence board interaction IS the protagonist's thought process
