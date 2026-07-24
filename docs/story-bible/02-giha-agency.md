# GIHA: Agency Profile

## 3.1 Official Identity

**Full name:** Global Information Health Agency

**Abbreviation:** GIHA (pronounced "gee-ha")

**Type:** Independent watchdog organization

**Status:** Non-governmental, non-profit, UN-affiliated

**Mandate:** Monitor and protect global information ecosystems from manipulation, disinformation, and synthetic media threats

**Headquarters:** Geneva, Switzerland (shared office space with other UN consultative NGOs)

**Founded:** 2021, in response to the "infodemic" during global health crises

## 3.2 Organizational Character

### The Paradox

GIHA has **official authority** but **operational constraints**:

| Aspect | Reality |
|--------|---------|
| **Legal status** | UN consultative status, recognized by 47 member states |
| **Budget** | $2.3M annual (less than most corporate PR departments) |
| **Staff** | 12 full-time investigators worldwide |
| **Equipment** | Government surplus, open-source tools, donated hardware |
| **Office** | Three desks, a server closet, and a coffee machine that's "always almost broken" |

### Tone: "Inspector Gadget Meets Spotlight"

- **Authority:** GIHA badges are recognized at borders, their reports are cited in parliaments
- **Reality:** Investigators fly economy, share hotel rooms, and eat conference freebies
- **Vibe:** Official mandate, guerrilla execution
- **Motto:** *"The world's information immune system runs on coffee and open-source intelligence."*

## 3.3 Mission Statement

> *Information is a public health issue.*
>
> *Just as pandemics exploit vulnerable populations, disinformation campaigns target information ecosystems with precision. They exploit economic anxiety, social isolation, institutional distrust, and cognitive bias.*
>
> *GIHA exists to monitor these threats, investigate their origins, and help communities build resilience.*
>
> *We are not censors. We are not police. We are diagnosticians. We find the infection. We recommend the treatment. The cure must come from within.*

## 3.4 Organizational Structure

```
                    ┌─────────────────────┐
                    │   Director (1)      │
                    │   Dr. Elena Voss    │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
   ┌────────┴────────┐ ┌──────┴──────┐ ┌────────┴────────┐
   │ Investigations  │ │  Analysis   │ │   Operations    │
   │   (4 people)    │ │  (3 people) │ │   (3 people)    │
   └────────┬────────┘ └──────┬──────┘ └────────┬────────┘
            │                 │                 │
      Field agents     Data analysts      Logistics,
      (like you)       OSINT specialists  procurement,
                                               IT
```

### Key Personnel

| Name | Role | Notes |
|------|------|-------|
| **Dr. Elena Voss** | Director | Former UN diplomat, true believer in information rights |
| **Marcus Chen** | Chief Analyst | Ex-NSA, disillusioned, now fights the other side |
| **Yara Abadi** | Field Operations | Logistics wizard, can get anything anywhere in 48 hours |
| **Dr. Amara Okafor** | Intelligence | Media studies professor, deepfake specialist (see: protagonist's first case) |

## 3.5 Resources and Limitations

### What GIHA Has

- **Official authority:** Their reports carry weight with governments and media
- **Global network:** 12 investigators across 6 time zones
- **Open-source intelligence:** Expertise in publicly available data
- **Institutional knowledge:** Database of known disinfo campaigns, tactics, actors
- **Moral credibility:** Non-partisan, non-profit, transparent funding

### What GIHA Lacks

- **Budget:** Can't afford proprietary tools, private intelligence, or large-scale operations
- **Personnel:** 12 investigators for 8 billion people
- **Speed:** Bureaucratic UN processes vs. real-time disinfo threats
- **Enforcement:** Can investigate but cannot arrest, sanction, or censor
- **Political will:** Some governments tolerate disinfo when it benefits them

### Operational Constraints (Gameplay-Relevant)

| Constraint | Gameplay Impact |
|------------|-----------------|
| Limited budget | Player must choose interventions strategically |
| Small team | Player works solo in Veritas, no backup |
| No legal authority | Can't compel evidence; must investigate legally |
| Reliance on OSINT | All forensics tools are open-source or simulated |
| Bureaucratic reporting | Results matter, but speed is personal |

## 3.6 GIHA Brand Identity

### Logo Concept

**Symbol:** A shield with a magnifying glass overlay — protection through investigation

**Colors:**
- Primary: Purple (#863bff) — as rendered in the production SVG
- Accent: Amber Gold (#F39C12) — insight, investigation, alertness
- Background: White or transparent

**Typography:** Clean, modern, institutional

> **Note:** The production SVG logo at `public/assets/logo/GIHA-Logo.svg` renders in purple (#863bff). The stationery palette (navy + gold) is used for in-game documents and case files, not the GIHA brand logo itself.

### Stationery Style

| Element | Specification |
|---------|---------------|
| **Header** | GIHA logo (left) + "CONFIDENTIAL" watermark (right) |
| **Colors** | Navy + Gold + White |
| **Typography** | Inter (headings), JetBrains Mono (data/reports) |
| **Paper** | White with subtle watermark pattern |
| **Borders** | Thin gold rule lines |

### UI Integration

- **GIHA badge:** Appears in top-left during detective mode
- **Case files:** Styled as official GIHA documents
- **Reports:** Formatted as GIHA intelligence briefs
- **HUD elements:** Navy + gold color scheme

## 3.7 Narrative Role

GIHA serves multiple narrative functions:

1. **Authority provider:** Player's actions have institutional weight
2. **Constraint creator:** Limited resources force strategic choices
3. **Worldbuilding anchor:** Establishes the global threat landscape
4. **Educational framing:** "Information health" metaphor teaches MIL concepts
5. **Underdog energy:** Small team vs. massive threat = compelling story

## 3.8 Design Rationale

| Decision | Rationale |
|----------|-----------|
| UN-affiliated but underfunded | Creates narrative tension: authority vs. resources |
| 12 investigators worldwide | Makes player feel special: chosen for important mission |
| No enforcement power | Forces investigation over action: MIL is about thinking, not fighting |
| Open-source tools | Grounds gameplay in realistic forensics techniques |
| "Information health" metaphor | Makes abstract MIL concepts tangible and relatable |

## 3.9 Implementation Notes

- GIHA logo appears in: game intro, detective mode HUD, case file headers, debrief screen
- GIHA stationery style applied to: all evidence documents, case briefs, reports
- Director Voss provides: opening briefing (text), occasional radio check-ins
- GIHA constraints: drive gameplay mechanics (budget, time, tool availability)
