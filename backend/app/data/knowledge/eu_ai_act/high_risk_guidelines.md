# Comprehensive Summary: Draft Commission Guidelines on the Classification of High-Risk AI Systems

This document provides a highly detailed, comprehensive summary of the European Commission's draft guidelines on the classification of high-risk Artificial Intelligence (AI) systems under Article 6 of Regulation (EU) 2024/1689 (the AI Act).

---

## 1. Introduction and General Principles

### 1.1. Regulatory Context and Objectives
The Artificial Intelligence Act (AI Act) entered into force on August 1, 2024, establishing a harmonised framework for placing AI systems on the market, putting them into service, and using them within the European Union. Its dual purpose is to foster innovation and the uptake of trustworthy AI while ensuring a high level of protection for health, safety, and fundamental rights, including democracy and the rule of law. 

The AI Act implements a strict risk-based approach, sorting AI practices into distinct risk tiers. High-risk AI systems are subject to specific technical requirements and organizational obligations (detailed in Chapter III, Section 2) imposed on both providers and deployers. These guidelines, issued pursuant to Article 6(5), assist operators and market surveillance authorities by providing authoritative interpretations and illustrative examples to ensure uniform enforcement across Member States. They are non-binding, as final authoritative interpretation rests with the Court of Justice of the European Union (CJEU).

### 1.2. The Definition of an AI System
To be classified as high-risk, a technology must first meet the legal definition of an AI system under Article 3(1):
* It must be a **machine-based system**.
* It must be designed to operate with **varying levels of autonomy**.
* It may exhibit **adaptiveness after deployment**.
* It must **infer, from the inputs it receives, how to generate outputs** (such as predictions, content, recommendations, or decisions) that can influence physical or virtual environments.

Traditional software, deterministic automated systems, or purely rule-based algorithms lacking adaptive or inferential features do not fall within the scope of the Act.

### 1.3. Intended Purpose vs. Reasonably Foreseeable Misuse
Classification depends strictly on the system's **intended purpose** as specified by the provider under Article 3(12). This intent is derived from:
* Instructions for use and technical documentation.
* Promotional materials, marketing positioning, and sales statements.

The intended purpose is legally distinct from "reasonably foreseeable misuse" (Article 3(13)), which represents unauthorized use outside the provider's defined scope. 

#### Multi-Purpose and General-Purpose AI (GPAI) Systems
If a provider presents a system broadly across a generality of contexts and fails to explicitly and coherently restrict or exclude high-risk use cases, the system's intended purpose will be legally deemed to encompass those high-risk scenarios. This applies where such high-risk implementations are technically feasible and foreseeable. Merely adding a disclaimer or a boilerplate restriction in the terms of service is legally insufficient if the provider's general product positioning, examples, or marketing material effectively promotes or facilitates high-risk applications.

### 1.4. Allocation of Responsibilities along the Value Chain (Article 25(1))
Distributors, importers, deployers, or other third parties will be legally reclassified as "providers" and assume all accompanying compliance obligations if they perform any of the following actions:
1. Affix their own name or trademark to a high-risk AI system already placed on the market or put into service.
2. Introduce a **substantial modification** to a high-risk AI system such that it remains high-risk.
3. Modify the intended purpose of an AI system (including a GPAI system) that was previously classified as non-high-risk, transforming it into a high-risk system under Article 6.

---

## 2. High-Risk Classification under Article 6(1) and Annex I (Regulated Products and Safety Components)

Article 6(1) operationalizes the risk-based framework for AI systems that operate as products themselves or as safety components of products already regulated under Union harmonisation legislation listed in Annex I. 

### 2.1. The Cumulative Conditions for Classification
An AI system falls under Article 6(1) only if it meets two cumulative criteria:
1. The AI system is itself a product covered by Union harmonisation legislation listed in Annex I, OR it is intended to be used as a safety component of such a product.
2. The product (or the AI system itself) is required to undergo a **third-party conformity assessment** prior to being placed on the market or put into service under that same Annex I legislation.

Annex I encompasses key sectors, including machinery, toys, lifts, radio equipment, pressure equipment, recreational craft, cableway installations, appliances burning gaseous fuels, medical devices, in vitro diagnostic medical devices, automotive, and aviation. The list is exhaustive and can only be amended by updating the underlying sectoral legislation or explicitly amending the AI Act.

### 2.2. Autonomous Definition of a "Safety Component" (Article 3(14))
The AI Act establishes an autonomous definition of a "safety component" that applies uniformly across all sectors, independent of definitions found in specific sectoral product legislation. Under Article 3(14), a component is a safety component if it falls into one of two alternative scenarios:

#### Scenario A: Fulfilling a Safety Function (Intent-Based)
The system is explicitly intended by its provider to prevent or mitigate risks to the health and safety of persons or property. 
* **Indicative Preventive Functions:** Real-time monitoring and detection of physical anomalies; maintenance predictors to prevent physical failure; mechanisms preventing a system from starting up during abnormal states; real-time sensor supervision of other safety assets.
* **Indicative Mitigation Functions:** Adjusting operational behavior to limit physical harm; triggering safe emergency stops under dangerous conditions; controlling another primary safety component.
* **Exclusions:** Features intended for performance optimization, service efficiency, automation, comfort, convenience, or quality control of non-safety metrics do not constitute a safety function.

#### Scenario B: Failure or Malfunctioning Endangering Safety (Consequences-Based)
Even if the system's primary purpose is non-safety oriented (e.g., efficiency), it qualifies as a safety component if its technical failure or malfunction poses a non-theoretical, context-specific danger to the health and safety of persons or property.
* **Harm to Health:** Includes physical illness, injury, permanent or temporary bodily impairment, chronic disease, and severe psychological trauma or mental health damage that impairs ordinary activities.
* **Harm to Property:** Involves direct physical destruction or loss of property.
* **Exclusions:** Non-physical or immaterial damages (reputational harm, purely financial loss, minor service degradation, or inconvenience) are excluded.

*Example:* An AI system designed solely to optimize combustion efficiency in a household gas appliance has an efficiency purpose (not a safety function). However, if its malfunction can cause carbon monoxide buildup or explosions, it constitutes a safety component under Scenario B. Conversely, a smart thermostat adjusting schedules based on household patterns to save energy only causes discomfort or higher bills upon failure, excluding it from safety component status.

### 2.3. The Third-Party Conformity Assessment Scrutiny
The second condition requires the underlying product to undergo a third-party conformity assessment according to the modules set out in Decision 768/2008/EC (Modules B, C, D, E, F, G, H, and their variants). 

#### The Scrutiny of Module A (Internal Control)
Module A relies solely on internal production control by the manufacturer and does not require a notified body. In specific legislations (e.g., the Toys Safety Regulation, Machinery Regulation, or Radio Equipment Regulation), the use of Module A is permitted *only* on the condition that the manufacturer strictly applies harmonised standards published in the Official Journal covering all relevant health and safety requirements. The guidelines clarify that this conditional reliance on harmonised standards constitutes mandatory external regulatory scrutiny. Therefore, such systems satisfy the second condition and are classified as high-risk under Article 6(1). The procedural flexibility given to a manufacturer does not alter the objective risk classification under the AI Act.

### 2.4. Minimisation of Compliance Burdens
To reduce double-regulatory friction, the AI Act includes coordination mechanisms (Articles 8(2), 9(10), and 17(3)) that allow economic operators to integrate AI-specific risk and quality assessments directly into their existing sectoral management frameworks. 

Furthermore, a significant distinction exists between Annex I sections:
* **Section A (New Legislative Framework):** Systems must comply with all high-risk requirements listed in Chapter III, Section 2.
* **Section B (Other Legislation):** Only Article 6(1), Articles 102–109, and Article 112 apply.

---

## 3. Horizontal Issues and Framework for Annex III Use Cases (Article 6(2))

Article 6(2) addresses certain stand-alone AI systems that are classified as high-risk because their intended purpose falls into specific use cases within eight broad socio-economic areas listed in Annex III. 

### 3.1. The Eight Areas of High-Risk Use Cases
1. Biometrics
2. Critical Infrastructure
3. Education and Vocational Training
4. Employment, Workers' Management, and Access to Self-Employment
5. Access to and Enjoyment of Essential Private Services and Essential Public Services and Benefits
6. Law Enforcement
7. Migration, Asylum, and Border Control Management
8. Administration of Justice and Democratic Processes

This list is exhaustive. Modifications can only occur via delegated acts adopted by the Commission under tight legal criteria (Article 7).

### 3.2. Horizontal Principles
The guidelines establish several horizontal principles for interpreting Annex III use cases:

* **Invariance to Human Involvement:** The presence of a human in the loop, or human oversight during deployment, does not alter a system's high-risk classification. Human oversight is an structural obligation under Article 14, not a tool to bypass classification.
* **Scope of Natural Persons:** Use cases concerning the evaluation of "natural persons" include consumers, sole traders, independent professionals, and the self-employed. If a system is strictly limited to evaluating legal entities (e.g., analyzing corporate balance sheets for a corporate loan), it is out of scope. However, if the system is used to evaluate the personal finances or traits of a natural person backing that company, or if it targets individual sole proprietors, it falls within scope.
* **Complex, Split, and Agentic AI Architectures:** To prevent circumvention by architectural design, if multiple AI modules form part of an interconnected setup (such as agentic AI systems coordinating through linked actions), and their joint outputs materially influence an individual decision within a high-risk use case, the configuration is treated as a single high-risk AI system. Genuinely separable, independently deployed modules that perform strictly auxiliary functions without structuring or feeding the core high-risk decision remain eligible for separate assessment.
* **"On Behalf Of" Public Authorities:** When use cases restrict scope to public authorities, the rules fully capture private or third-party entities to whom a public authority has outsourced or delegated its core functions. It does not apply if a private entity acts independently to fulfill an independent statutory obligation (e.g., a private bank running fraud checks under AML laws).
* **Legal Sufficiency:** High-risk classification under Annex III means a system is subject to heavy safeguards; it does not authorize or imply that the system’s use is legally permitted under other Union or national laws.

---

## 4. The Article 6(3) Filter Mechanism and the Profiling Exclusion

Article 6(3) introduces a "filter mechanism" designed to prevent over-regulation. A provider whose system technically falls under an Annex III use case can exempt it from high-risk requirements if it does not pose a significant risk of harm to health, safety, or fundamental rights, specifically because it does not materially influence the substance or outcome of decision-making.

### 4.1. The Four Alternative Conditions for the Filter
To qualify for the filter, an AI system must exclusively perform at least one of these four narrowly interpreted tasks:
1. **Condition (a) - Narrow Procedural Task:** The system handles data processing or organization without making value judgments, evaluations, or rankings. Examples include converting unstructured data into structured tables, indexing files, sorting documents into predefined folders, or identifying exact duplicates.
2. **Condition (b) - Improving a Previously Completed Human Activity:** The AI acts ex-post to refine or check human work without altering the core substance, conclusion, or legal positioning. Examples include checking finalized texts for grammar, formatting, corporate style consistency, or flagging clear internal contradictions.
3. **Condition (c) - Detecting Decision-Making Patterns or Anomalies:** The system performs an ex-post comparative analysis against historical data trends to highlight anomalies for comprehensive human review. It must operate on fully completed assessments and must not generate new substantive criteria or modify active live files autonomously. An example is an AI tool checking for deviations in a teacher's grading patterns.
4. **Condition (d) - Preparatory Task to an Assessment:** The system carries out background work prior to the actual assessment phase, presenting low-level structural inputs (e.g., retrieving relevant legal provisions or internal guidelines matching a case file) without providing a specific evaluation or recommendation.

### 4.2. The Strict Exclusion for Profiling
The filter mechanism is **completely unavailable** if the AI system performs profiling of natural persons. Under the third subparagraph of Article 6(3), any system executing profiling within an Annex III use case is automatically high-risk.

Profiling is defined as any automated processing of personal data used to evaluate, analyze, or predict a natural person’s personal characteristics, attributes, or behavioral patterns (such as performance at work, economic status, health, personal preferences, reliability, or movements). Simple classification based on raw factual data (e.g., sorting by age or height) is not profiling unless it is executed to derive conclusions, assessments, or predictions about that individual's behavior or suitability.

### 4.3. Enforcement and Compliance Obligations for Filtered Systems
Providers cannot simply walk away from the AI Act if they apply the filter. Under Article 6(4), they must fulfill strict compliance checkpoints before the system enters the market:
* **Documentation:** They must completely document the assessment, including the system's exact purpose, why it would normally be high-risk under Annex III, the specific filter condition relied upon, and technical proof that it does not perform profiling. This documentation must be immediately available to market surveillance authorities upon request.
* **Registration:** The provider must formally register the exempted AI system in the centralized EU database established under Article 71 to ensure public traceability.

Market surveillance authorities are empowered to audit these records. If they discover misclassification used to circumvent the Act, they can order immediate corrective actions and impose severe administrative fines and penalties under Article 99.

---

## 5. Granular Review of Specific Annex III High-Risk Use Cases and Exemptions

### 5.1. Area 1: Biometrics
This area addresses systems that are highly intrusive and present significant risks of systemic bias, historical discrimination, and chilling effects on fundamental rights.

#### Remote Biometric Identification (RBI) Systems (Point 1(a))
An RBI system involves identifying natural persons without their active involvement, typically at a distance, by comparing their biometric data with a reference database.
* **High-Risk Examples:** Real-time or post-event facial recognition on media archives or public/private CCTV feeds to catch suspects or public figures; voiceprint matching across large databases; gait analysis to track individuals.
* **The Verification Exception (Out of Scope):** Pure 1-to-1 biometric verification or authentication systems whose sole purpose is confirming a claimed identity for device unlocking, logging into a personal bank account, remote exam proctoring, or controlling access to secure physical premises (e.g., a power plant or corporate office) are explicitly excluded from high-risk classification, as their impact on fundamental rights is minimal.
* **The Active Involvement Standard:** If individuals must consciously participate (e.g., stepping up to a biometric turnstile to activate a metro ticket or standing inside a marked zone facing a scanner), it is not remote and is out of scope.
* **Law Enforcement Authorisation (Article 26(10)):** Deploying a high-risk *post-RBI* system for a targeted search of a known suspect or convict within an active criminal investigation requires binding judicial or administrative authorization. However, **"initial identification"** (comparing a biometric trace or mugshot collected from a crime scene against a database to find out an unknown person's identity) is explicitly exempt from the judicial authorization requirement, though the underlying AI tool remains classified as high-risk. Untargeted, indiscriminate surveillance using post-RBI is universally banned.

#### Biometric Categorisation Systems (Point 1(b))
Assigning individuals to specific categories based on biometric inputs.
* **High-Risk Scope:** Systems that infer sensitive or protected attributes under Article 9(1) GDPR—specifically **ethnic origin, genetic data, and data concerning health** (e.g., scanning gait to categorize patients by early-stage neurological disease).
* **Prohibited Practice (Article 5(1)(g)):** Systems used to deduce an individual's race, political opinions, trade union membership, religious/philosophical beliefs, sex life, or sexual orientation are strictly prohibited and do not reach the high-risk framework.
* **Out of Scope Examples:** Systems categorizing individuals by non-sensitive attributes like **age or gender** (e.g., retail tools for personalized ads or age-gating for tobacco vending machines) are out of scope under this point, provided they do not process sensitive data or perform high-risk profiling in other sectors (such as border management). Purely ancillary features technically necessary for a commercial service are also excluded.

#### Emotion Recognition Systems (Point 1(c))
Identifying or inferring emotions or intentions based on biometric data.
* **High-Risk Scope:** Systems measuring vocal pitch, facial micro-expressions, or posture to gauge audience moods at events, analyze customer satisfaction in call centers, or assess aggression levels via police bodycams outside prohibited zones.
* **Prohibitions (Article 5(1)(f)):** Emotion recognition is completely banned within workplaces and educational institutions, unless deployed explicitly for strict medical or safety reasons (which are then categorized as high-risk).
* **Out of Scope Examples:** Systems tracking strictly physical states like **drowsiness, fatigue, or pain** (e.g., automotive safety systems detecting a pilot or driver falling asleep) are completely out of scope. Mere detection of apparent expressions (e.g., a broadcaster counting how many times a presenter smiles) without inferring an emotional state is also exempt.

### 5.2. Area 2: Critical Infrastructure
This framework addresses safety components within specific critical infrastructures where technical failure could cause large-scale loss of life or severe socio-economic disruption.

#### General Scrutiny Criteria
For an AI system to be high-risk here, it must meet two conditions:
1. It must be a safety component under Article 3(14) (directly protecting physical integrity or preventing physical harm/damage). Informational, organizational, or mere optimization tools (e.g., traffic data analytics that provide insights but do not execute physical signaling adjustments) are out of scope.
2. It must be deployed by an operator formally identified as a critical entity by a Member State under the **Critical Entities Resilience (CER) Directive (Directive (EU) 2022/2557)**. Third-party providers do not need to know the critical status; compliance can be mandated inside confidential procurement contracts.

#### Specific Infrastructure Domains
* **Digital Infrastructure:** Restricted to essential services under the CER Delegated Regulation (IXPs, DNS providers, TLD registries, public cloud computing, and electronic communication networks). *High-Risk Example:* An AI-driven fire alarm control system inside a critical cloud data center. *Out of Scope:* AI used for network load prediction, trouble-ticket management, or interacting with a technical user guide.
* **Road Traffic:** Restricted to surface roads (excluding waterways). *High-Risk Examples:** Systems adjusting traffic lights in real time to prevent collisions; AI detecting heavy loads on vulnerable bridges to prevent collapse. *Out of Scope:* Traffic flow data platforms that optimize congestion routing but have no control over signal safety.
* **Supply of Water, Gas, Heating, and Electricity:** Covers essential physical transmission, generation, and distribution systems. *High-Risk Examples:* Automated water pressure sensors preventing main bursts; grid anomaly detectors automating power load distribution or shutdown procedures. *Out of Scope:* Quality assurance of meter installations; energy demand forecasting; and predictive maintenance where an independent fallback system prevents physical failure.
* **The Exclusions:** Components designed *solely* for **cybersecurity purposes** (e.g., honeypots, malware detectors, network traffic threat identifiers) are explicitly excluded from being safety components, provided they have no direct physical safety control role. Furthermore, all **nuclear-specific elements** governed by specialized treaties are completely excluded from Area 2.

### 5.3. Area 3: Education and Vocational Training
This section protects individual learning paths, access to livelihoods, and fundamental rights from flawed, biased, or opaque algorithmic decisions.

* **Personal Scope:** Broadly encompasses public and private, formal and non-formal, tertiary, adult, continuing, and vocational training institutions. It focuses strictly on systems targeting learners (students, apprentices), not tools for training educators.
* **Point 3(a) - Access and Admission:** AI evaluating student transcripts, scores, and financial records to automate admissions, school assignment zoning, or scholarship allocations. Because these systems evaluate individual files to determine access, they constitute profiling, making the filter mechanism unavailable. Back-office file indexing or document translation remains filter-eligible under Condition (d).
* **Point 3(b) - Evaluating Learning Outcomes:** Restricted exclusively to **summative evaluation** (systems proposing final grades, or intermediate marks that directly affect academic standing or credentials). Continuous **formative evaluation tools** designed strictly for feedback and support (e.g., adaptive learning apps, intelligent tutoring systems, or independent language learning software chosen by the user) are completely out of scope, provided they do not lead to a formal public certification.
* **Point 3(c) - Assessing Appropriate Level of Education:** Adaptive placement tests determining whether an incoming student enters beginner, intermediate, or advanced tracks, and AI classifiers assigning special education needs placements.
* **Point 3(d) - Prohibited Behaviour Monitoring:** Automated proctoring systems (live or remote) checking for cheating, plagiarism, or collusion *during active controlled test situations* via facial analysis or keystroke monitoring. It excludes post-submission plagiarism checking software for essays or homework, and general non-testing surveillance (e.g., detecting cafeteria bullying), though the latter may trigger biometrics rules.

### 5.4. Area 4: Employment, Workers' Management, and Access to Self-Employment
This area addresses structural power asymmetries between employers/contracting organizations and workers, ensuring protection for livelihoods and career prospects.

* **Personal Scope:** Extends beyond formal employment contracts to encompass the entire spectrum of labor, including platform workers, freelancers, independent contractors, and solo self-employed individuals whose access to work is conditioned by algorithms.
* **Point 4(a) - Recruitment and Selection:** Covers systems mapping the entire entry pipeline: algorithmic placement of targeted job advertisements, automated CV screening, candidate sourcing tools scraping professional sites, candidate testing/grading, and automated background checks.
  * *The Profiling Lock:* Ads or background checks that process personal data to evaluate candidates execute profiling and cannot use the filter. Factual accreditation checkers confirming a credential (e.g., matching a bar membership number) or automated scheduling tools are exempt under the narrow procedural filter. General employer branding ads unconnected to a concrete vacancy are out of scope.
* **Point 4(b) - Workplace Management:** AI systems used to make decisions affecting fundamental work terms (pay adjustments, time scheduling, denial of leave, or training tied to promotion), promotions, or contractual terminations (including automated suspension or deactivation of platform worker accounts). It also includes systems allocating tasks based on behavioral scoring (e.g., response times, shift acceptance rates) or systematically monitoring and evaluating worker performance.
  * *Exemptions:* Day-to-day minor organizational tools (office desk booking, travel itinerary planning, or adjusting break times within an assigned shift) are out of scope. Automated aggregation of sales data shared *exclusively with the worker* for self-improvement is out of scope. Systems monitoring for pure legal compliance (e.g., logging trader transactions to catch financial market abuse) or pure safety reasons are also exempt.

### 5.5. Area 5: Access to and Enjoyment of Essential Private and Public Services and Benefits
Protects individuals from financial and social exclusion, targeting vulnerable positions vis-à-vis state organs or critical private service providers.

* **Point 5(a) - Public Assistance Eligibility:** AI deployed by or on behalf of public authorities to evaluate, grant, reduce, revoke, or reclaim essential public assistance benefits and services (healthcare, sickness benefits, maternity/paternity support, old-age pensions, unemployment benefits, social housing, child care, and utility subsidies). Flagging application irregularities or potential fraud is high-risk because it delays or suspends access. Chatbots answering factual procedural questions or tools translating files can be filtered under Conditions (a) and (d). Tax remission systems are out of scope.
* **Point 5(b) - Creditworthiness and Credit Scoring:** AI evaluating a natural person’s credit risk or establishing their credit score to determine access to loans, mortgages, bank accounts, or utility lines.
  * *The Fraud Detection Exception:* Systems whose primary, overriding purpose is the detection of financial fraud (e.g., verifying if an ID card is forged or checking data alterations) are explicitly **exempt from high-risk classification**, even if their output is utilized downstream in a credit file. Internal models used by financial institutions *solely* to calculate risk-weighted assets for internal capital requirements under the Internal Ratings-Based (IRB) approach are out of scope, provided they are not utilized for actual credit-granting decisions. Margin credit for complex, non-essential financial trading products is out of scope.
* **Point 5(c) - Life and Health Insurance:** AI performing risk assessment or setting premium pricing for natural persons regarding life, health, private long-term care, or credit life insurance policies. It covers all stages from initial quote generation to policy revocation. Claims management tools (validating a claim *after* an insured event occurs) and aggregate product design simulations are out of scope. Unlike point 5(b), there is **no exception for fraud detection** within the insurance framework.
* **Point 5(d) - Emergency Call Evaluation and Response:** Systems evaluating and classifying emergency text, video, or voice calls (e.g., 112 routing), dispatching emergency first responders (police, firefighters, medical aid), prioritizing dispatch queues based on severity, or running patient triage within emergency rooms. Triage systems qualifying as medical devices fall under Article 6(1). Excludes general aggregate disaster forecasting (e.g., mapping wildfire risk vectors before any call occurs), simulated training platforms, and network connectivity routers. Pre-emergency asset positioning based on weather data can be filtered as a preparatory task.

### 5.6. Area 6: Law Enforcement
Protects due process, presumption of innocence, and individual liberty within active criminal justice contexts. Purely administrative procedures (tax/customs tariff enforcement, administrative AML analytics by Financial Intelligence Units) are out of scope.

* **Point 6(a) - Victim Risk Assessment:** AI assessing an individual's specific, forward-looking likelihood of becoming a crime victim (e.g., domestic violence vulnerability scores or human trafficking risk indices). It excludes location-focused crime mapping or cataclysm modeling.
* **Point 6(b) - Polygraphs and Similar Tools:** Systems inferring truthfulness or deception via voice stress, micro-expressions, eye-tracking, or brain imaging during police questioning. Excludes officer stress monitoring or tools reviewing the performance of polygraph examiners.
* **Point 6(c) - Evaluating Evidence Reliability:** Digital forensic solutions validating the authenticity or integrity of evidence within an active investigation (e.g., deepfake video detectors, signature forgery analyzers, or source credibility checkers). Excludes image enhancement tools, 3D crime scene reconstructions, and ballistic matching databases (which constitute simple similarity searches).
* **Point 6(d) - Offending or Reoffending Risk Assessment:** Post-detention algorithms computing recidivism risks or guiding court parole decisions based on an active link to a criminal event. It must not violate the absolute ban on predictive policing (Article 5(1)(d)), which prohibits predicting crimes based *solely* on profiling personality traits without objective, facts-linked suspicion.
* **Point 6(e) - General Profiling:** AI systems evaluating personal data to single out potential suspects from the general public or monitoring targeted online spheres to assign risk flags for extremist affiliation.

### 5.7. Area 7: Migration, Asylum, and Border Control Management
Protects highly vulnerable mobile populations whose entry, stay, or detention is determined by automated systems.

* **Point 7(a) - Polygraphs or Similar Tools:** Automated deception or credibility indicators deployed during visa, residence, or asylum interviews. Filter-eligible only for raw signal normalization (denoising).
* **Point 7(b) - Risk Assessment of Entering/Staying Persons:** Generating individual risk scores (security, irregular migration, or health risks) during travel authorization processing (e.g., ETIAS tracking overstay risks). Excludes aggregate cohort flow analytics or vehicle-focused logistics lanes.
* **Point 7(c) - Assistance in Examining Applications and Complaints:** AI supporting the substantive review of asylum, visa, or residence requests, including country-of-origin voice inference or phone data timeline validation. File completeness checkers or FAQ guides are out of scope.
* **Point 7(d) - Detecting, Recognising, or Identifying Persons:** Live facial recognition at border checkpoints, satellite imagery tracking human presence along land/sea border crossing points, or sensor arrays identifying hidden occupants in vehicles. It explicitly excludes the technical verification of physical travel documents. Systems used *exclusively* for search-and-rescue or collision avoidance are out of scope, but if a system serves a dual function supporting border enforcement, it is high-risk.

### 5.8. Area 8: Administration of Justice and Democratic Processes
Safeguards the rule of law, judicial independence, and democratic voting integrity.

* **Point 8(a) - Assisting Judicial Authorities & Alternative Dispute Resolution (ADR):** Systems used by or on behalf of judges or ADR bodies to research/interpret facts and law, apply statutes to a concrete case, or generate draft judgments/reasoning. This captures court-appointed experts preparing mandatory reports, but excludes party-appointed experts or attorney-side legal tech tools. Purely clerical speech-to-text court transcription, court fee verifiers, public information chatbots, and case assignment software are out of scope. Case pre-classifiers are filter-eligible unless they make binding admissibility rulings. For ADR bodies, the system is high-risk only if the proceeding produces legally binding or enforceable effects for at least one party (e.g., binding consumer arbitration awards).
* **Point 8(b) - Influencing Elections or Referenda:** AI systems specifically intended to influence voting behavior (e.g., specialized ad delivery targeters using profiling, or interactive conversational virtual campaign spokespersons) where natural persons are directly exposed to the output. It explicitly excludes back-office political campaign optimization tools (logistics, schedule organizers, donor database analyzers) or generative AI tools used strictly to draft slogans for human review before dissemination. Politically neutral chatbots run by election authorities giving factual voting information are out of scope.

---

## 6. Implementation Timeline and Governance Framework

### 6.1. Postponed Application Dates (AI Omnibus Realignment)
The guidelines incorporate the updated legal timeline adjusted by the AI Omnibus legislation:
* **December 2, 2027:** High-risk rules and corresponding provider/deployer compliance obligations become fully applicable for systems classified under **Article 6(2) and Annex III**.
* **August 2, 2028:** High-risk frameworks become fully applicable for systems classified under **Article 6(1) and Annex I** (regulated products).

### 6.2. Grandfathering and Compliance Milestones
* **Existing Systems:** High-risk AI systems placed on the market or put into service before December 2, 2027, are grandfathered and exempt from the rules, *unless* they undergo a significant change in their design or intended purpose after that date. For credit-scoring models within the banking sector, the definition of a "material change" under the Internal Ratings-Based (IRB) approach serves as the benchmark for determining a significant design change.
* **Public Authorities Transition:** High-risk AI systems utilized by public authorities must be brought into absolute compliance with the Act by **August 2, 2030**, regardless of their initial deployment date.
* **Large-Scale IT Infrastructure:** AI systems operating as components of the major EU databases listed in Annex X (such as VIS, SIS, Eurodac, EES, ETIAS) placed on the market before August 2, 2027, must be brought into absolute compliance by **31 December 2030**.

### 6.3. Future-Proofing Mechanisms
The AI Office and national competent market surveillance authorities supervise this framework. To support ongoing technical shifts:
* **AI Regulatory Sandboxes** must be fully operational across all Member States by **August 2, 2026**, allowing controlled real-world testing of high-risk concepts.
* **Annual Reviews:** Under Article 112(1), the Commission executes an annual review of Annex III. It retains delegated powers to expand, modify, or delete high-risk use cases or add conditions to the Article 6(3) filter mechanism to match evolving market realities.
