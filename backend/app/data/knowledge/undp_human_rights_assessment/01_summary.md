# UNDP AI Human Rights Impact Assessment (HRIA) Toolkit — In-Depth Summary

**Document:** *Human Rights Impact of AI Assessment Toolkit*
**Publisher:** United Nations Development Programme (UNDP), Istanbul Regional Hub
**Date:** December 2025 (initial release)
**Scope:** International — with particular focus on Eastern Europe, Caucasus, Central Asia, and Western Balkans

## 1. Purpose and Context

The toolkit was created to address a critical gap: the rapid adoption of AI across governments and businesses is outpacing the development of human rights safeguards. Across the regions covered, governments are deploying AI for e-government, legal automation, "Smart City" surveillance, and predictive policing — often without adequate legal frameworks. The toolkit provides a **structured, practical methodology** for any organisation to proactively identify, assess, and mitigate the human rights risks of AI systems throughout their entire lifecycle, from design to deployment and ongoing monitoring.

It is grounded in international human rights law standards, including:
- **UN Guiding Principles on Business and Human Rights (UNGPs)** — the three pillars of Protect, Respect, and Remedy
- **OECD AI Principles** — inclusive growth, human-centred values, transparency, robustness, accountability
- **EU AI Act** — the risk-based regulatory framework for AI systems
- **Council of Europe Framework Convention on AI and Human Rights** (May 2024)

## 2. Target Audience

The toolkit is specifically designed for **non-technical stakeholders** who need to engage with AI systems but lack deep technical knowledge:
- Human rights experts
- Policymakers
- Corporate compliance officers
- National Human Rights Institution (NHRI) staff
- Project managers and developers involved in AI projects
- Civil society organisations

## 3. Three-Part Structure

### Part 1: Technical Manual for AI Human Rights Impact Assessment

**Purpose:** Demystify AI for human rights practitioners by explaining core concepts in accessible terms and identifying where human rights risks emerge.

**Key content areas:**

**Section 2 — Core AI Concepts:** Explains AI, Machine Learning, Neural Networks/Deep Learning, Generative AI, and Predictive Analytics. Each is paired with human rights risk examples (e.g., credit scoring perpetuating bias, facial recognition misidentifying people of colour, deepfakes spreading disinformation).

**Section 3 — The AI Lifecycle ("Plumbing"):** Maps human rights risks at each stage:
- **Data Collection:** Risks of non-representative data leading to discrimination; privacy violations from scraping without consent; GDPR Article 7 implications
- **Data Preparation:** Bias amplification through subjective labelling; historically biased labels reinforcing systemic discrimination
- **Data Management:** Insecure pipelines risking data breaches; lack of documentation hindering oversight
- **Model Training:** Training process encoding historical discrimination into model logic; resource concentration limiting AI development to large entities; overfitting leading to unreliable real-world performance
- **Model Evaluation:** Overall accuracy masking poor performance for specific subgroups (e.g., facial recognition 99% accurate overall but failing for women of colour); need for disaggregated fairness metrics
- **Deployment & Monitoring:** Contextual harms from inappropriate deployment; automation bias from humans uncritically accepting AI outputs; need for meaningful human oversight and right to remedy; model drift causing harm over time
- **Transparency & Documentation:** Need for explainable AI (XAI); Model Cards for standardised documentation; accountability requires clear records of data sources, design choices, and evaluation results

**Section 4 — Preliminary Technical Probing (Pre-HRIA):** Provides practical, no-coding-required techniques for initial assessment:
- **Key questions for developers/vendors** organised by: Data, Training, Model & Performance, Transparency & Deployment
- **Probing techniques:** Input testing (edge cases), bias probing (identical prompts with different demographic personas), functionality testing, accessibility checks, output review (hallucinations, biased content)
- **Four scenario-based applications:** AI grading systems, corporate LLM chatbot procurement, public citizen enquiry AI, AI hiring tools

**Case Study — Dutch SyRI System:** Detailed analysis of the Dutch welfare fraud prediction system that was struck down by the Hague District Court in February 2020 for violating:
1. Right to privacy (ECHR Article 8) — mass, indiscriminate linking of personal data
2. Transparency and due process — secret algorithm, citizens could not know why they were flagged
3. Discrimination — exclusively deployed in low-income, immigrant-heavy neighbourhoods

The case study demonstrates how applying the toolkit's framework could have identified these violations before judicial intervention.

**Section 5 — Alignment with International Frameworks:** Maps the HRIA methodology to UNGPs (three pillars), OECD AI Principles (five principles), and the EU AI Act (risk-based approach with mandatory FRIA for high-risk systems).

### Part 2: Readiness Assessment

**Purpose:** A structured self-evaluation questionnaire enabling organisations to assess their capacity and preparedness for conducting HRIAs of AI systems.

**Scoring system:** 1-5 scale per question:
- 1 = Initial Stage (limited awareness/informal approaches)
- 2 = Developing Stage (basic practices, not formalised)
- 3 = Established Stage (formal practices, may not be comprehensive)
- 4 = Advanced Stage (comprehensive practices, regular implementation)
- 5 = Leading Stage (exemplary practices, continuous improvement)

**Three assessment dimensions (10 questions each):**

**Policy & Culture:** Covers whether the organisation prioritises human rights in AI projects, has documented policies, leadership support, open environment for reporting concerns, stakeholder engagement, and transparency.

**People & Expertise:** Covers management understanding, employee training, designated staff/teams, external collaboration, whistleblower protection, feedback processes, legal expertise, resources, industry participation, and skills gap assessment.

**Processes Assessment:** Covers AI strategy, third-party AI assessment procedures, systematic risk identification, stakeholder engagement in deployment, pre-deployment HRIA/DPIA, data security protocols, regulatory updates, oversight processes, failure mitigation, and redress mechanisms.

**Score interpretation:**
- 1.0–1.9: Initial Stage — urgent action needed
- 2.0–2.9: Developing Stage — basic practices need formalisation
- 3.0–3.9: Established Stage — strengthen comprehensiveness
- 4.0–4.9: Advanced Stage — maintain and refine
- 5.0: Leading Stage — exemplary, focus on continuous improvement

**Recommendations triggered by scores below 3.5** in any dimension, with urgent recommendations if overall score is below 2.5.

### Part 3: AI Human Rights Impact Assessment Model

**Purpose:** Provide a comprehensive, expert-based methodology and model template for conducting systematic HRIAs of AI systems.

**Key design principles:**
- **Ex ante approach** — assess before deployment, not after harm occurs; adopt a "by-design" approach
- **Rights-based focus on risk assessment** — human rights are not traded off against economic benefits; they hold a prominent role, with restrictions justified only by equally relevant competing interests
- **Circular iterative structure** — aligned with ISO 31000 risk management; planning/scoping, risk analysis, risk treatment, monitoring phases repeat as conditions change
- **Expert-based** — requires multidisciplinary expertise combining human rights law, AI design, and contextual societal understanding
- **Context-specific** — cannot be fully automated; parameters must be adapted to the specific AI system, its use, and deployment context

**The "zero question":** Before any assessment, ask whether an AI-based solution is even necessary — could the same goal be achieved through non-algorithmic alternatives?

**Phase 1 — Planning & Scoping (Awareness-Raising Questionnaire):**
Structured around four sections:
- **Section A:** Description and analysis of the AI system (purpose, characteristics, deployment countries, data types, rights-holders, duty-bearers)
- **Section B:** Human rights context — identification of potentially affected rights, applicable legal instruments, relevant courts/bodies, key case law. Includes a comprehensive checklist of rights across categories: Dignity/Personality/Autonomy, Economic/Social/Cultural, Vulnerable Groups, Justice, Political
- **Section C:** Controls already in place (existing policies, prior impact assessments)
- **Section D:** Stakeholder engagement and Human Rights Due Diligence (affected communities, civil society, experts, supply chain assessment, public communication, training)

**Phase 2 — Data Collection and Risk Analysis (Assessment Tool):**
Risk quantification follows four steps:
1. **Analysis of the level of impact** on potentially affected rights
2. **Identification of appropriate measures** to prevent/mitigate risk
3. **Implementation** of such measures
4. **Monitoring** to revise assessment as conditions change

**Risk measurement methodology:**
- **Likelihood** = Probability of adverse outcomes x Exposure (proportion of rights-holders affected)
- **Severity** = Gravity of prejudice (intensity, consequences, importance of the right, group-specific impacts, vulnerability) x Effort to overcome/reverse adverse effects
- Both dimensions assessed using **4x4 qualitative risk matrices** (Low, Medium, High, Very High)
- **Overall risk index** per right = Likelihood x Severity, visualised via radial graphs

**Key methodological guidelines from best practices analysis:**
- Use common risk management circular approach
- Avoid cumulative assessment of impacts on different rights (assess each right independently)
- Avoid splitting impacted rights into different components (prevents double-counting)
- Use transparent, consistent scoring with ordinal variables
- Use matrices with clear, justified scaling criteria
- Relationship between risk components must be consistent with fundamental rights framework
- Consider the **balancing test** for conflicting rights and potential benefits only after individual impact assessment

**Factors that may exclude risk:** Legal limitations on certain rights (e.g., mandatory data processing characteristics) that justify certain impacts as acceptable.

**Phase 3 — Risk Management:**
- Measures must prevent or mitigate any risk to fundamental rights
- Further rounds of assessment conducted on **residual risk** after mitigation measures
- Mitigation measures are context-dependent and cannot be provided as a generic list

**Case Study — Medical AI for Cancer Treatment Prediction:**
A fully worked example applying the entire HRIA model to an AI system predicting chemotherapy treatment response using medical images. Demonstrates:
- Planning & scoping (system description, data flows, rights-holders, stakeholders)
- Risk analysis for three rights: data protection/privacy, non-discrimination, right to physical and mental health
- Risk matrices showing how likelihood and severity combine
- Risk management measures (expanding training datasets, informing professionals of limitations)
- Residual risk assessment after mitigation

## 4. Annex I — Potential Impacts of AI on Human Rights

Comprehensive reference table mapping 20+ internationally recognised human rights to concrete examples of AI impacts, including:
- **Self-determination:** Political manipulation, nudging, exploitative data collection
- **Right to life:** Autonomous weapons, fatal product defects, border control
- **Freedom from torture:** AI optimising interrogation schedules
- **Liberty and security:** Voice simulation for fraud
- **Freedom of movement:** Border control, smart mobility surveillance
- **Due process:** Algorithmic expulsion assessments
- **Fair trial:** AI in judicial decision-making, predictive policing
- **Privacy:** Emotion detection, mass surveillance, data collection without legal basis
- **Freedom of thought/conscience:** Content moderation, child-interacting AI
- **Freedom of expression:** Content moderation, disinformation
- **Freedom from propaganda/hatred:** Online propaganda amplification
- **Freedom of assembly:** Facial recognition at protests
- **Freedom of association:** Social media surveillance
- **Child protection:** AI in recommendation systems, CSAM generation
- **Public participation:** Surveillance chilling political participation, e-voting AI
- **Non-discrimination:** Biometric identification bias, hiring algorithms, credit scoring
- **Minorities' rights:** LLM underrepresentation and stereotyping
- **Right to work:** AI recruitment, task allocation, performance monitoring
- **Social security:** Eligibility evaluation biases
- **Right to health:** Diagnostic tools, triage systems
- **Right to education:** AI-based admissions and performance prediction
- **Cultural/IP rights:** Training on copyrighted material, generative AI infringement

## 5. Key Takeaways

1. HRIA for AI is **not optional** — it is increasingly mandated by law (EU AI Act, Council of Europe Framework Convention) and expected by international standards (UNGPs, OECD)
2. The assessment must be **conducted before deployment** (ex ante), not reactively after harm
3. It requires **expert-led, multidisciplinary analysis** — not a checkbox exercise
4. The process is **circular and iterative** — reassessment is required as technology, context, and regulations evolve
5. Each right must be assessed **independently** — no cumulative indices that trade off one right against another
6. The toolkit is designed as a **living document** that will be updated as the field develops
