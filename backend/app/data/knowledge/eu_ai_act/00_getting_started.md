# Getting Started: Bare Minimum to Launch an AI Project Under the EU AI Act

A practical starting point distilled from the three core reference documents in this repository.

---

## 1. Determine Your Risk Classification First

This is the single most important step. Before writing any code:

- **Is your system even an AI system?** (Article 3(1) — it must infer from inputs, not just be rule-based software)
- **Is it prohibited?** (Social scoring, manipulative systems, untargeted facial scraping, emotion recognition in workplaces/schools, etc.)
- **Is it high-risk?** Two pathways:
  - **Annex I** — safety component of a regulated product (medical devices, machinery, vehicles)
  - **Annex III** — standalone use in biometrics, employment, credit scoring, law enforcement, education, migration, justice, critical infrastructure
- **Does the Article 6(3) filter apply?** Your system might escape high-risk if it only does narrow procedural tasks — but **any profiling of natural persons kills this exemption**

The [high_risk_guidelines.md](high_risk_guidelines.md) is the most actionable document for this step, with concrete examples of what's in/out of scope for each area.

---

## 2. If High-Risk: The Non-Negotiable Checklist

These are the mandatory systems you need to plan for **from day one** (not retrofitted):

| Requirement | What It Means in Practice |
|---|---|
| **Risk Management System** (Art. 9) | Define risk appetite, identify risks by component, iterate throughout lifecycle |
| **Data Governance** (Art. 10) | Quality controls on training/validation/test data, bias analysis, documented collection processes |
| **Quality Management System** (Art. 17) | 13 elements covering design, testing, change management, incident response, accountability |
| **Human Oversight** (Art. 14) | Design for human-in-the-loop from the start — stop buttons, override capability, anti-automation-bias measures |
| **Conformity Assessment** (Art. 43) | Internal self-assessment or notified body depending on system type |
| **Technical Documentation** (Annex IV) | Comprehensive docs before market entry, retained 10 years |

---

## 3. If Not High-Risk: You Still Have Obligations

Transparency requirements apply regardless of risk classification:

- **Chatbots and virtual assistants**: Users must be informed they are interacting with an AI system
- **Synthetic content** (generative AI output): Outputs must be machine-readably marked as AI-generated
- **Deepfakes**: Must be clearly disclosed as artificially created or altered
- **Emotion recognition / biometric categorisation**: Exposed persons must be explicitly informed

---

## 4. Which Document to Read When

| If You Need... | Read |
|---|---|
| Am I even regulated? What's banned? What are the fines? | [eu_ai_act_summary.md](eu_ai_act_summary.md) |
| Is my specific use case high-risk? With examples | [high_risk_guidelines.md](high_risk_guidelines.md) |
| How do I actually comply? Step-by-step | [sandbox_guidelines.md](sandbox_guidelines.md) |

---

## 5. The Shortest Path

1. **Read [high_risk_guidelines.md](high_risk_guidelines.md) Sections 3–5** to classify your system
2. **If high-risk**, read [sandbox_guidelines.md](sandbox_guidelines.md) Guides 3 (conformity assessment) and 5 (risk management) — these two define the structure everything else hangs on
3. **If not high-risk**, review [eu_ai_act_summary.md](eu_ai_act_summary.md) Section 11 for transparency obligations

---

## 6. Key Penalties

| Infringement | Maximum Fine |
|---|---|
| Prohibited AI practices | Up to **EUR 35,000,000** or **7%** of global annual turnover |
| Other system obligations | Up to **EUR 15,000,000** or **3%** of global annual turnover |
| Misleading information to regulators | Up to **EUR 7,500,000** or **1%** of global annual turnover |

SMEs and startups are subject to the same fixed amounts or percentages, **whichever is lower**.

---

## 7. Key Dates

| Milestone | Date |
|---|---|
| Prohibited practices take effect | 6 months after entry into force |
| GPAI obligations, governance, penalties | 12 months after entry into force |
| High-risk Annex III systems fully applicable | **December 2, 2027** |
| High-risk Annex I (product) systems fully applicable | **August 2, 2028** |
| Public authority systems must comply | **August 2, 2030** |
| Legacy large-scale IT systems (Schengen, Eurodac, etc.) | **December 31, 2030** |

---

**Bottom line:** Classification drives everything. Get that wrong and you're either over-engineering compliance or exposed to the fines listed above.
