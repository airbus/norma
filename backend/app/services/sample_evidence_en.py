# ruff: noqa: E501
SAMPLE_EVIDENCE_EN: dict[str, str] = {
    # =========================================================================
    # EU AI ACT — Cybersecurity (Article 15)
    # =========================================================================
    "cybersecurity-CYB-01-0": "Training datasets are stored in an immutable registry with SHA-256 checksums; any modification triggers an alert and requires dual approval before retraining.",
    "cybersecurity-CYB-01-1": "All facial image data ingested during fine-tuning is validated against a signed provenance manifest and checked for tampering before use.",
    "cybersecurity-CYB-02-0": "Quarterly adversarial testing is conducted using morphed and spoofed facial images to evaluate model resilience under attack conditions.",
    "cybersecurity-CYB-02-1": "Anti-spoofing modules including liveness detection and infrared depth sensing are deployed to maintain recognition accuracy against adversarial inputs.",
    "cybersecurity-CYB-03-0": "Input validation rejects all non-image payloads; the system processes only camera-captured frames and does not accept free-text prompts.",
    "cybersecurity-CYB-04-0": "Model weights are encrypted with AES-256 at rest and stored in a hardware security module; access requires multi-factor authentication and is logged.",
    "cybersecurity-CYB-05-0": "Output is limited to access granted/denied decisions and confidence scores; no raw biometric templates or facial embeddings are exposed via any interface.",
    "cybersecurity-CYB-06-0": "All third-party libraries and container images are scanned weekly using Trivy and Dependabot, with critical vulnerabilities patched within 48 hours.",
    "cybersecurity-CYB-07-0": "Role-based access control enforces separation between security operators, system administrators, and data protection officers, with quarterly access reviews.",
    "cybersecurity-CYB-08-0": "The recognition system operates within an isolated VLAN behind a next-generation firewall; training environments are air-gapped from production networks.",
    "cybersecurity-CYB-09-0": "All access decisions, enrolment events, and configuration changes are written to append-only logs stored in a tamper-evident WORM storage system.",
    "cybersecurity-CYB-10-0": "Facial templates and enrolment images are encrypted with AES-256 at rest; all camera-to-server communication uses TLS 1.3 mutual authentication.",
    "cybersecurity-CYB-11-0": "Monthly vulnerability scans and annual penetration tests are performed; patch management follows a 72-hour SLA for critical findings.",
    # =========================================================================
    # EU AI ACT — Documentation (Article 11, Annex IV)
    # =========================================================================
    # MG01: Documentation strategy
    "documentation-MG01-0": "A documentation strategy defines all deliverables for the facial recognition system, covering technical design, DPIA, and EU AI Act compliance records.",
    "documentation-MG01-1": "The strategy is reviewed annually by the compliance team and updated whenever regulatory guidance or system architecture changes.",
    # MG02: Update calendar
    "documentation-MG02-0": "A documentation update calendar schedules quarterly reviews aligned with system release cycles and annual regulatory compliance deadlines.",
    "documentation-MG02-1": "Calendar adherence is tracked via Jira tickets; overdue reviews trigger automated escalation to the project manager.",
    # MG03: Version control
    "documentation-MG03-0": "All technical documentation is maintained in a Git repository with mandatory pull-request reviews and semantic versioning.",
    "documentation-MG03-1": "Each document version is tagged with the corresponding system release, enabling full traceability between software and documentation states.",
    # MG04: Communication plan
    "documentation-MG04-0": "A communication plan ensures that documentation updates are distributed to security operators, DPO, and building management within five working days.",
    "documentation-MG04-1": "Distribution is tracked via read-receipt confirmations; stakeholders who have not acknowledged updates receive automated reminders.",
    # MG05: Responsible parties
    "documentation-MG05-0": "The AI systems lead owns technical documentation; the DPO owns privacy documentation; the quality manager owns QMS records.",
    "documentation-MG05-1": "A RACI matrix defines responsibilities for each document type, reviewed and signed off by department heads annually.",
    # MG06: Repository management
    "documentation-MG06-0": "All documentation is stored in a centralised SharePoint site with folder structures mirroring the EU AI Act annex requirements.",
    "documentation-MG06-1": "Repository health checks run monthly to identify orphaned files, broken links, and documents past their review date.",
    # MG07: Access policies
    "documentation-MG07-0": "Document access follows the principle of least privilege; only authorised personnel can view biometric-related technical specifications.",
    "documentation-MG07-1": "Access permissions are reviewed quarterly; leavers are revoked within 24 hours of offboarding.",
    # MG08: Security/backup
    "documentation-MG08-0": "Documentation repositories are backed up daily to a geographically separate data centre with 30-day retention and AES-256 encryption.",
    "documentation-MG08-1": "Backup restoration is tested quarterly; the last successful test restored the full repository in under four hours.",
    # MG09: Retention
    "documentation-MG09-0": "Documentation is retained for ten years after system decommissioning, in line with EU AI Act record-keeping requirements.",
    "documentation-MG09-1": "Retention schedules are enforced automatically; documents past retention are flagged for secure deletion with DPO approval.",
    # MG10: Naming conventions
    "documentation-MG10-0": "A standardised naming convention includes document type, system name, version, and date (e.g., TECH-FRAC-v2.1-2025-03).",
    "documentation-MG10-1": "Naming compliance is enforced via repository validation rules that reject non-conforming file names on upload.",
    # MG11: Format consistency
    "documentation-MG11-0": "All documents use approved corporate templates with consistent heading structures, ensuring uniform presentation across compliance deliverables.",
    "documentation-MG11-1": "Template compliance is verified during peer review; documents not using the current template are returned for correction.",
    # MG12: Metrics framework
    "documentation-MG12-0": "Documentation completeness is measured against a checklist of 45 required items mapped to EU AI Act Annex IV; current coverage is 100%.",
    "documentation-MG12-1": "Monthly metrics reports track document currency, review completion rates, and outstanding action items for management review.",
    # MG13: Lifecycle management
    "documentation-MG13-0": "Each document has a defined lifecycle from draft through approval, publication, review, and eventual archival or retirement.",
    "documentation-MG13-1": "Lifecycle transitions require sign-off by the document owner and are recorded in the document management system audit trail.",
    # MG14: Change control
    "documentation-MG14-0": "All documentation changes follow a formal change-control process with impact assessment, peer review, and approval gate.",
    "documentation-MG14-1": "Change requests are logged in the change management system with full traceability to the originating requirement or incident.",
    # MG15: Cross-departmental access
    "documentation-MG15-0": "Facilities, HR, legal, and IT security teams have read access to relevant system documentation via role-based SharePoint permissions.",
    "documentation-MG15-1": "Cross-departmental access needs are reviewed biannually; new access requests require line-manager and DPO approval.",
    # MG16: Supplier documentation
    "documentation-MG16-0": "The camera hardware supplier and recognition algorithm vendor provide technical datasheets, conformity declarations, and API documentation.",
    "documentation-MG16-1": "Supplier documentation is reviewed at each contract renewal and archived alongside internal system documentation.",
    # MG17: System description
    "documentation-MG17-0": "The system description details the facial recognition pipeline: image capture, pre-processing, embedding extraction, matching, and access decision.",
    "documentation-MG17-1": "It includes architecture diagrams showing camera placement, edge processing units, central server, and database topology.",
    # MG18: Purpose/scope
    "documentation-MG18-0": "The system's purpose is to authenticate employees via facial recognition at building entry points, replacing badge-based access.",
    "documentation-MG18-1": "Scope is limited to access control; the system is not used for surveillance, tracking, or emotion recognition.",
    # MG19: Development methodology
    "documentation-MG19-0": "Development follows an agile methodology with two-week sprints, incorporating security-by-design and privacy-by-design principles.",
    # MG20: Data governance
    "documentation-MG20-0": "A data governance framework governs facial image collection, storage, and deletion in compliance with GDPR Article 9 requirements.",
    "documentation-MG20-1": "Data governance roles, policies, and procedures are documented and cross-referenced with the DPIA.",
    # MG21: Infrastructure
    "documentation-MG21-0": "Infrastructure documentation covers on-premises GPU servers, network topology, camera specifications, and edge computing devices.",
    "documentation-MG21-1": "Capacity planning documents demonstrate that the infrastructure supports 2,000 concurrent recognition requests per site.",
    # MG22: Risk management
    "documentation-MG22-0": "Risk management documentation identifies 47 risks across bias, security, privacy, and operational categories with assigned mitigations.",
    "documentation-MG22-1": "The risk register is maintained in a dedicated tool and reviewed quarterly by the risk committee.",
    # MG23: Conformity assessment
    "documentation-MG23-0": "A conformity assessment report demonstrates compliance with EU AI Act requirements for high-risk biometric identification systems.",
    "documentation-MG23-1": "The assessment was conducted by an accredited notified body and the certificate is valid until March 2027.",
    # MG24: Quality management
    "documentation-MG24-0": "Quality management documentation describes the QMS scope, processes, and controls specific to the facial recognition system.",
    "documentation-MG24-1": "QMS documentation is aligned with ISO 9001 and includes procedures for non-conformance handling and corrective actions.",
    # MG25: Monitoring plans
    "documentation-MG25-0": "Post-deployment monitoring plans define KPIs including recognition accuracy, false rejection rate, and system availability.",
    "documentation-MG25-1": "Monitoring procedures specify alert thresholds, escalation paths, and responsible teams for each KPI.",
    # MG26: Accuracy metrics
    "documentation-MG26-0": "Accuracy metric documentation reports a 99.7% true acceptance rate and 0.01% false acceptance rate across demographic groups.",
    "documentation-MG26-1": "Metrics are disaggregated by age, gender, and ethnicity to ensure equitable performance across all employee groups.",
    # MG27: Regulatory compliance
    "documentation-MG27-0": "A compliance mapping document traces each EU AI Act article to the corresponding system control, evidence, and responsible owner.",
    "documentation-MG27-1": "Regulatory compliance documentation is updated within 30 days of any new guidance from the AI Office.",
    # MG28: Third-party components
    "documentation-MG28-0": "Third-party components include the facial recognition SDK, camera firmware, and anti-spoofing module, each with documented licences and versions.",
    "documentation-MG28-1": "A software bill of materials (SBOM) is maintained and updated with each system release.",
    # MG29: Version changelog
    "documentation-MG29-0": "A version changelog records all system changes, including model updates, threshold adjustments, and infrastructure modifications.",
    "documentation-MG29-1": "Each changelog entry links to the corresponding change request, test report, and approval record.",
    # MG30: Accessibility requirements
    "documentation-MG30-0": "Accessibility documentation addresses alternative access methods for employees unable to use facial recognition due to disability.",
    "documentation-MG30-1": "Badge-based fallback and assisted entry procedures are documented and available at every access point.",
    # MG31: Performance benchmarks
    "documentation-MG31-0": "Performance benchmarks document sub-second recognition latency, 99.95% system uptime, and throughput of 30 authentications per minute per gate.",
    "documentation-MG31-1": "Benchmarks are validated against real-world conditions including varying lighting and peak-hour traffic.",
    # MG32: Safety margins
    "documentation-MG32-0": "Safety margins are documented: the matching threshold is set 15% above the minimum required to maintain accuracy under adverse conditions.",
    "documentation-MG32-1": "Margin adequacy is validated quarterly using degraded-condition testing with low-light and partial-occlusion scenarios.",
    # MG33: Environmental conditions
    "documentation-MG33-0": "Operating conditions are documented: indoor temperature 15–30°C, lighting 200–1000 lux, humidity below 80%.",
    "documentation-MG33-1": "Performance degradation outside specified conditions is quantified and mitigated by supplementary IR illumination at entry points.",
    # MG34: User manual
    "documentation-MG34-0": "A user manual provides security operators with step-by-step instructions for enrolment, monitoring, override, and troubleshooting.",
    "documentation-MG34-1": "The manual includes visual guides for each procedure and is available in all official languages of deployed sites.",
    # MG35: Deployment procedures
    "documentation-MG35-0": "Deployment procedures document camera installation, network configuration, model deployment, and integration testing at each building.",
    "documentation-MG35-1": "A deployment checklist must be completed and signed off by IT and security teams before the system goes live.",
    # MG36: Maintenance procedures
    "documentation-MG36-0": "Maintenance procedures specify monthly camera cleaning, quarterly lens calibration, and biannual model performance re-evaluation.",
    "documentation-MG36-1": "Scheduled maintenance windows are communicated to building management 72 hours in advance to arrange fallback access.",
    # MG37: Incident response
    "documentation-MG37-0": "An incident response plan covers system failures, data breaches, and false acceptance events with defined roles and communication chains.",
    "documentation-MG37-1": "The plan is tested biannually through tabletop exercises simulating a biometric data breach scenario.",
    # MG38: Decommissioning plan
    "documentation-MG38-0": "The decommissioning plan mandates secure deletion of all facial templates and enrolment images within 30 days of system retirement.",
    "documentation-MG38-1": "Hardware disposal follows WEEE regulations; storage media undergoes certified physical destruction.",
    # MG39: Training materials
    "documentation-MG39-0": "Training materials cover system operation, data protection obligations, bias awareness, and incident escalation for security staff.",
    "documentation-MG39-1": "Training completion is tracked in the learning management system; refresher courses are mandatory annually.",
    # MG40: Compliance mapping
    "documentation-MG40-0": "A compliance mapping matrix links each EU AI Act requirement to the specific system control, document, and evidence artefact.",
    "documentation-MG40-1": "The mapping is maintained by the compliance team and validated during annual internal audits.",
    # MG41: Audit trail
    "documentation-MG41-0": "The documentation audit trail records every document creation, modification, review, and approval event with timestamps and user IDs.",
    "documentation-MG41-1": "Audit trail integrity is protected by append-only storage and is available for inspection by regulators on request.",
    # MG42: Feedback integration
    "documentation-MG42-0": "Feedback from security operators, employees, and auditors is logged and reviewed quarterly to identify documentation gaps.",
    "documentation-MG42-1": "Feedback-driven improvements are tracked as action items and closed within 60 days of receipt.",
    # MG43: Continuous improvement
    "documentation-MG43-0": "A continuous improvement register tracks documentation enhancements driven by audit findings, incidents, and regulatory updates.",
    "documentation-MG43-1": "Improvement initiatives are prioritised in quarterly planning and reported to management review.",
    # MG44: Final review sign-off
    "documentation-MG44-0": "All documentation packages require final sign-off by the AI systems lead, DPO, and quality manager before release.",
    "documentation-MG44-1": "Sign-off records are stored alongside the released documents and include reviewer comments and approval dates.",
    # MG45 (if applicable — extra item)
    "documentation-MG45-0": "A final documentation completeness review is conducted before each major release, verifying all 45 Annex IV items are addressed.",
    "documentation-MG45-1": "The review outcome is formally recorded and any gaps are resolved before the system enters production.",
    # =========================================================================
    # EU AI ACT — QMS (Article 17)
    # =========================================================================
    # QMS-01: Quality policy
    "qms-QMS-01-0": "The quality policy commits to delivering a facial recognition system that is accurate, unbiased, and compliant with the EU AI Act.",
    "qms-QMS-01-1": "The policy is approved by senior management and communicated to all staff involved in the system's development and operation.",
    # QMS-02: Quality objectives
    "qms-QMS-02-0": "Quality objectives include maintaining a false acceptance rate below 0.01%, achieving 99.95% uptime, and zero unresolved bias findings per quarter.",
    # QMS-03: Design/development procedures
    "qms-QMS-03-0": "Design procedures require threat modelling, bias impact assessment, and privacy review at each development phase gate.",
    # QMS-04: Data management
    "qms-QMS-04-0": "Data management procedures govern facial image collection, labelling, storage, and deletion in accordance with GDPR Article 9.",
    "qms-QMS-04-1": "Data quality checks verify image resolution, labelling accuracy, and demographic representativeness before training use.",
    # QMS-05: Supplier management
    "qms-QMS-05-0": "Camera and algorithm suppliers are evaluated against quality, security, and EU AI Act compliance criteria before onboarding.",
    # QMS-06: Testing/validation
    "qms-QMS-06-0": "Testing procedures include unit tests, integration tests, bias tests across demographic groups, and acceptance testing at each site.",
    # QMS-07: Configuration management
    "qms-QMS-07-0": "Configuration management tracks all system components including model versions, threshold settings, camera firmware, and network configurations.",
    # QMS-08: Corrective actions
    "qms-QMS-08-0": "Corrective action procedures require root-cause analysis within five working days and implementation of corrective measures within 30 days.",
    # QMS-09: Complaint handling
    "qms-QMS-09-0": "Employees can submit complaints about recognition failures or privacy concerns via a dedicated portal; all complaints are acknowledged within 48 hours.",
    # QMS-10: Communication
    "qms-QMS-10-0": "Internal communication procedures ensure that quality alerts, system changes, and compliance updates reach all relevant stakeholders promptly.",
    # QMS-11: Document control
    "qms-QMS-11-0": "Document control procedures ensure that only current, approved versions of procedures and work instructions are available to staff.",
    # QMS-12: Management review
    "qms-QMS-12-0": "Management reviews are conducted biannually, covering system performance, audit results, complaints, and regulatory developments.",
    # QMS-13: Internal audit
    "qms-QMS-13-0": "Annual internal audits assess compliance with QMS procedures, EU AI Act requirements, and GDPR obligations related to biometric processing.",
    # QMS-14: Training/competence
    "qms-QMS-14-0": "Competence requirements are defined for each role; security operators complete 16 hours of initial training and 8 hours annually.",
    # QMS-15: Continuous improvement
    "qms-QMS-15-0": "Continuous improvement is driven by KPI analysis, audit findings, complaint trends, and post-incident reviews.",
    # QMS-16: Regulatory engagement
    "qms-QMS-16-0": "The compliance team monitors EU AI Act implementing acts and guidelines, attending AI Office consultations and industry working groups.",
    # =========================================================================
    # EU AI ACT — Incidents (Article 73)
    # =========================================================================
    # M-INC-01: Incident definition
    "incidents-M-INC-01-0": "Incidents are defined as any false acceptance granting unauthorised access, system outage exceeding 15 minutes, or biometric data breach.",
    "incidents-M-INC-01-1": "The incident taxonomy distinguishes between safety incidents, security incidents, rights-impacting events, and operational failures.",
    # M-INC-02: Reporting timelines
    "incidents-M-INC-02-0": "Serious incidents are reported to the national market surveillance authority within 72 hours, as required by Article 73.",
    "incidents-M-INC-02-1": "Internal incident reports are submitted within 4 hours; the DPO is notified immediately for any biometric data breach.",
    # M-INC-03: Investigation procedures
    "incidents-M-INC-03-0": "Each incident triggers a structured investigation including log analysis, camera footage review, and model decision reconstruction.",
    "incidents-M-INC-03-1": "Investigation outcomes are documented in a standardised report template and reviewed by the incident review board within 10 days.",
    # M-INC-04: Corrective actions
    "incidents-M-INC-04-0": "Corrective actions are defined based on root-cause analysis; examples include threshold recalibration and anti-spoofing module updates.",
    "incidents-M-INC-04-1": "Corrective action effectiveness is verified through targeted testing before the action is closed in the CAPA register.",
    # M-INC-05: Communication protocols
    "incidents-M-INC-05-0": "Communication protocols define escalation chains from security operators to building management, DPO, and senior leadership.",
    "incidents-M-INC-05-1": "Affected employees are notified within 24 hours of any incident involving their biometric data, in accordance with GDPR Article 34.",
    # =========================================================================
    # EU AI ACT — Risk Management (Article 9)
    # =========================================================================
    # MG01: Risk management framework
    "risk-management-MG01-0": "A risk management framework aligned with ISO 14971 and the EU AI Act governs all risks arising from the facial recognition system.",
    "risk-management-MG01-1": "The framework defines risk appetite, assessment methodology, and governance structure with clear accountability at board level.",
    # MG02: Risk identification
    "risk-management-MG02-0": "Risk identification workshops with security, legal, HR, and engineering teams have identified 47 risks including bias, spoofing, and data breaches.",
    # MG03: Risk analysis
    "risk-management-MG03-0": "Each risk is analysed for likelihood and severity using a 5×5 matrix, considering both operational impact and fundamental rights harm.",
    # MG04: Risk evaluation
    "risk-management-MG04-0": "Risks are evaluated against predefined acceptance criteria; any risk scoring above 15 on the 5×5 matrix requires escalation to the risk committee.",
    # MG05: Risk treatment
    "risk-management-MG05-0": "Risk treatment measures include liveness detection for spoofing, demographic bias testing, and fallback badge access for system failures.",
    # MG06: Residual risk
    "risk-management-MG06-0": "Residual risks are assessed after treatment; the residual false acceptance risk is rated low following anti-spoofing implementation.",
    # MG07: Risk monitoring
    "risk-management-MG07-0": "Risk indicators are monitored continuously, including false acceptance rates, recognition accuracy drift, and security event frequency.",
    # MG08: Risk communication
    "risk-management-MG08-0": "Risk reports are shared with building management, the DPO, and employee representatives quarterly, covering current risk posture.",
    # MG09: Risk documentation
    "risk-management-MG09-0": "The risk register is maintained in a dedicated GRC tool with full audit trail of all risk assessments, decisions, and treatment actions.",
    "risk-management-MG09-1": "Risk documentation is structured to satisfy EU AI Act Annex IV requirements and is available for regulatory inspection.",
    # MG10: Risk review
    "risk-management-MG10-0": "Formal risk reviews are conducted quarterly and after any significant system change, incident, or regulatory update.",
    # MG11: Stakeholder risks
    "risk-management-MG11-0": "Risks to employees include privacy intrusion, discriminatory denial of access, and psychological impact of biometric surveillance.",
    "risk-management-MG11-1": "Stakeholder-specific mitigations include transparent communication, opt-out alternatives, and a dedicated complaints mechanism.",
    # MG12: Cross-system risks
    "risk-management-MG12-0": "Cross-system risks are assessed where the facial recognition system interfaces with physical access control, HR, and visitor management systems.",
    "risk-management-MG12-1": "Interface failure modes are documented with defined fallback procedures for each integration point.",
    # MG13: Emerging risks
    "risk-management-MG13-0": "Emerging risks such as deepfake attacks and regulatory changes are monitored through threat intelligence feeds and regulatory trackers.",
    # MG14: Risk governance
    "risk-management-MG14-0": "A risk committee comprising the CTO, DPO, CISO, and legal counsel oversees risk governance with quarterly meetings and escalation authority.",
    "risk-management-MG14-1": "The committee's terms of reference, membership, and decision records are documented and reviewed annually.",
    # =========================================================================
    # EU AI ACT — Data Governance (Article 10)
    # =========================================================================
    # MG01: Data governance framework
    "data-governance-MG01-0": "A data governance framework defines policies for facial image collection, processing, and deletion, aligned with GDPR Article 9 and the EU AI Act.",
    "data-governance-MG01-1": "The framework assigns data stewardship roles and establishes a data governance board with quarterly oversight meetings.",
    # MG02: Data quality
    "data-governance-MG02-0": "Data quality standards require minimum 720p resolution, consistent lighting, and frontal pose for enrolment images; non-conforming images are rejected.",
    "data-governance-MG02-1": "Automated quality checks validate image sharpness, face detection confidence, and metadata completeness before database ingestion.",
    # MG03: Data collection
    "data-governance-MG03-0": "Facial images are collected only during voluntary enrolment sessions with explicit informed consent and clear purpose limitation.",
    # MG04: Data labelling
    "data-governance-MG04-0": "Enrolment images are labelled with employee ID, site, and capture date; no demographic labels are stored alongside biometric data.",
    # MG05: Data storage
    "data-governance-MG05-0": "Facial templates are stored in an encrypted on-premises database; raw images are deleted after template extraction and quality verification.",
    "data-governance-MG05-1": "Storage infrastructure is located within the EU and subject to physical access controls and environmental monitoring.",
    # MG06: Data access
    "data-governance-MG06-0": "Access to biometric data is restricted to authorised personnel via role-based access control; all access is logged and auditable.",
    "data-governance-MG06-1": "Data access reviews are conducted quarterly; any anomalous access patterns trigger immediate investigation by the security team.",
    # MG07: Data retention
    "data-governance-MG07-0": "Facial templates are retained only while the employee is active; templates are deleted within 30 days of employment termination.",
    "data-governance-MG07-1": "Retention periods are enforced automatically by the data lifecycle management system with DPO oversight.",
    # MG08: Data deletion
    "data-governance-MG08-0": "Data deletion follows NIST 800-88 guidelines; cryptographic erasure is used for database records and secure overwrite for backup media.",
    # MG09: Bias detection
    "data-governance-MG09-0": "Bias detection analyses are performed on the training dataset to identify under-representation of age, gender, and ethnic groups.",
    "data-governance-MG09-1": "Detected imbalances are corrected through targeted data collection or augmentation before model retraining.",
    # MG10: Representativeness
    "data-governance-MG10-0": "The training dataset reflects the demographic composition of the employee population across all deployed sites.",
    # MG11: Data documentation
    "data-governance-MG11-0": "A data card documents the training dataset's composition, collection methodology, quality criteria, and known limitations.",
    "data-governance-MG11-1": "Data documentation is versioned alongside model releases and included in the technical documentation package.",
    # MG12: Data lineage
    "data-governance-MG12-0": "Data lineage tracks each facial image from capture through pre-processing, template extraction, and storage with full traceability.",
    # MG13: Data security
    "data-governance-MG13-0": "Biometric data is encrypted with AES-256 at rest and transmitted via TLS 1.3; database access requires multi-factor authentication.",
    "data-governance-MG13-1": "Annual penetration tests specifically target the biometric data stores and have found no critical vulnerabilities in the last assessment.",
    # MG14: Privacy compliance
    "data-governance-MG14-0": "A DPIA was conducted for the facial recognition system and approved by the DPO; it is reviewed annually or upon significant changes.",
    # MG15: Cross-border transfer
    "data-governance-MG15-0": "No biometric data is transferred outside the EU/EEA; all processing and storage occurs within EU-located data centres.",
    "data-governance-MG15-1": "Technical controls prevent data replication to non-EU regions; this is verified through quarterly infrastructure audits.",
    # MG16: Data sharing
    "data-governance-MG16-0": "Biometric data is not shared with third parties; the algorithm vendor receives only anonymised performance metrics for support purposes.",
    # MG17: Continuous monitoring
    "data-governance-MG17-0": "Data quality and integrity are monitored continuously through automated checks on database consistency and template validity.",
    # MG18: Accountability
    "data-governance-MG18-0": "The DPO is accountable for biometric data governance; the AI systems lead is accountable for training data quality and bias management.",
    "data-governance-MG18-1": "Accountability is formalised in role descriptions and the data governance charter, reviewed and signed annually.",
    # =========================================================================
    # EU AI ACT — Accuracy (Article 15)
    # =========================================================================
    # MG01: Accuracy metrics
    "accuracy-MG01-0": "Primary accuracy metrics are true acceptance rate (TAR), false acceptance rate (FAR), and false rejection rate (FRR), measured at the operational threshold.",
    "accuracy-MG01-1": "Current performance: TAR 99.7%, FAR 0.01%, FRR 0.3%, validated on the operational test dataset.",
    "accuracy-MG01-2": "Metrics are calculated using ISO/IEC 19795-1 methodology for biometric performance testing.",
    # MG02: Performance benchmarks
    "accuracy-MG02-0": "Performance benchmarks require FAR below 0.05% and FRR below 1.0% to meet the security and usability requirements.",
    "accuracy-MG02-1": "Benchmarks are derived from industry standards for building access control and validated with facility security stakeholders.",
    "accuracy-MG02-2": "Benchmark compliance is verified at each model release and after any threshold adjustment.",
    # MG03: Validation methodology
    "accuracy-MG03-0": "Validation uses a held-out test set of 10,000 genuine and 50,000 impostor image pairs, ensuring no overlap with training data.",
    "accuracy-MG03-1": "Cross-validation with k=5 folds is performed during development; final validation uses the independent held-out set.",
    "accuracy-MG03-2": "Validation methodology is documented and reviewed by an independent quality assurance team.",
    # MG04: Test datasets
    "accuracy-MG04-0": "Test datasets are demographically balanced and include variations in lighting, pose, ageing, and facial accessories.",
    "accuracy-MG04-1": "Datasets are refreshed annually with new enrolment images to account for employee population changes.",
    "accuracy-MG04-2": "Test data provenance and consent records are maintained alongside the test dataset documentation.",
    # MG05: Subgroup accuracy
    "accuracy-MG05-0": "Accuracy is measured across subgroups defined by age, gender, ethnicity, and facial hair to detect differential performance.",
    "accuracy-MG05-1": "No subgroup shows FAR above 0.05% or FRR above 1.5%; any deviation triggers immediate investigation and retraining.",
    # MG06: Accuracy monitoring
    "accuracy-MG06-0": "Production accuracy is monitored daily through automated sampling of recognition decisions against manual verification.",
    "accuracy-MG06-1": "Weekly accuracy dashboards are reviewed by the operations team; monthly reports are submitted to management.",
    # MG07: Degradation detection
    "accuracy-MG07-0": "Statistical process control charts detect accuracy degradation; a drop of 0.5% in TAR triggers an automated alert.",
    "accuracy-MG07-1": "Degradation root-cause analysis covers model drift, camera calibration, lighting changes, and population shifts.",
    # MG08: Accuracy thresholds
    "accuracy-MG08-0": "The matching threshold is set at a score of 0.85, balancing security (low FAR) against usability (low FRR).",
    "accuracy-MG08-1": "Threshold selection is documented with ROC curve analysis and approved by the security and operations teams.",
    # MG09: False positive/negative rates
    "accuracy-MG09-0": "False positive (false acceptance) events are investigated individually; each is logged with camera ID, timestamp, and matched identity.",
    "accuracy-MG09-1": "False negative (false rejection) events are tracked and analysed for patterns; employees experiencing repeat rejections are offered re-enrolment.",
    # MG10: Calibration
    "accuracy-MG10-0": "Model confidence scores are calibrated so that a 0.95 score corresponds to a 95% true match probability, validated via reliability diagrams.",
    "accuracy-MG10-1": "Calibration is verified quarterly and recalibrated if the expected calibration error exceeds 2%.",
    # MG11: Accuracy reporting
    "accuracy-MG11-0": "Accuracy reports are generated monthly for internal review and quarterly for regulatory compliance documentation.",
    "accuracy-MG11-1": "Reports include overall metrics, subgroup breakdowns, trend analysis, and comparison against defined benchmarks.",
    # MG12: User impact
    "accuracy-MG12-0": "User impact assessment shows that the average employee experiences fewer than one false rejection per month at a sub-second gate delay.",
    "accuracy-MG12-1": "Employees who experience more than three false rejections per week are contacted by HR and offered re-enrolment.",
    # MG13: Continuous evaluation
    "accuracy-MG13-0": "Continuous evaluation samples 2% of daily recognition decisions for manual review by trained security operators.",
    "accuracy-MG13-1": "Evaluation findings are fed back into the model improvement pipeline and documented in the continuous improvement register.",
    # MG14: External validation
    "accuracy-MG14-0": "An independent test laboratory conducted external validation using NIST FRVT methodology, confirming published accuracy claims.",
    "accuracy-MG14-1": "External validation is repeated biennially or following any major model update, with results shared in the technical documentation.",
    # =========================================================================
    # EU AI ACT — Records (Article 12)
    # =========================================================================
    # MG01: Logging framework
    "records-MG01-0": "A centralised logging framework captures all system events using structured JSON format with standardised fields and severity levels.",
    "records-MG01-1": "The framework is built on the ELK stack, providing searchable, aggregable log storage with role-based access.",
    "records-MG01-2": "Logging configuration is version-controlled and changes require approval through the change management process.",
    # MG02: Event logging
    "records-MG02-0": "All recognition events are logged, including camera ID, timestamp, match score, decision outcome, and processing latency.",
    "records-MG02-1": "System lifecycle events such as startup, shutdown, model loading, and configuration changes are logged with full context.",
    # MG03: Access logging
    "records-MG03-0": "All administrative access to the system, database, and configuration is logged with user identity, action, and timestamp.",
    "records-MG03-1": "Failed access attempts and privilege escalations generate immediate alerts to the security operations centre.",
    "records-MG03-2": "Access logs are correlated with IAM records to detect orphaned accounts and unauthorised access patterns.",
    # MG04: Decision logging
    "records-MG04-0": "Each access decision is logged with the input image hash, matched template ID, confidence score, and binary grant/deny outcome.",
    "records-MG04-1": "Decision logs enable full reconstruction of any individual access decision for audit or complaint investigation.",
    # MG05: Data lineage
    "records-MG05-0": "Data lineage records trace each training image from collection through pre-processing and augmentation to its use in model training.",
    "records-MG05-1": "Lineage metadata links each model version to the exact dataset version and training configuration used.",
    # MG06: Audit trails
    "records-MG06-0": "Comprehensive audit trails cover system configuration, model deployment, threshold changes, and enrolment operations.",
    "records-MG06-1": "Audit trails are stored in append-only WORM storage with cryptographic integrity verification.",
    # MG07: Log retention
    "records-MG07-0": "Operational logs are retained for 12 months; audit logs and decision logs are retained for 10 years per EU AI Act requirements.",
    "records-MG07-1": "Retention policies are enforced automatically with graduated storage tiering from hot to cold storage.",
    "records-MG07-2": "Retention period compliance is audited annually and documented in the records management report.",
    # MG08: Log integrity
    "records-MG08-0": "Log integrity is protected through SHA-256 hash chains; any tampering is detectable through automated integrity verification.",
    "records-MG08-1": "Write access to log storage is restricted to the logging service account; human write access is prohibited.",
    # MG09: Log access control
    "records-MG09-0": "Log access is governed by role-based controls; security operators see operational logs while auditors access decision and audit logs.",
    "records-MG09-1": "Log access is itself logged, creating a meta-audit trail for regulatory inspection.",
    # MG10: Log review
    "records-MG10-0": "Automated log review identifies anomalies including unusual access patterns, accuracy deviations, and system errors daily.",
    "records-MG10-1": "Security analysts review flagged anomalies within four hours; findings are escalated per the incident response procedure.",
    # MG11: Automated alerts
    "records-MG11-0": "Automated alerts trigger on predefined conditions including system failures, accuracy drops, and suspected security incidents.",
    "records-MG11-1": "Alert thresholds are calibrated to minimise false alerts while ensuring no critical event goes undetected.",
    # MG12: Log format
    "records-MG12-0": "Logs follow a standardised JSON schema with ISO 8601 timestamps, correlation IDs, and structured key-value fields.",
    "records-MG12-1": "The log schema is versioned; changes are backward-compatible to ensure consistent querying across historical data.",
    # MG13: Regulatory compliance
    "records-MG13-0": "The logging system satisfies EU AI Act Article 12 requirements for automatic log generation covering system operation periods.",
    "records-MG13-1": "Logs are structured to facilitate regulatory inspection with pre-built query templates for common compliance questions.",
    # MG14: Log backup
    "records-MG14-0": "Logs are replicated to a geographically separate backup site with a recovery point objective of one hour.",
    "records-MG14-1": "Backup restoration is tested quarterly; the last test achieved full recovery within two hours.",
    # MG15: Performance logging
    "records-MG15-0": "Performance metrics including recognition latency, throughput, CPU/GPU utilisation, and queue depth are logged every 30 seconds.",
    # MG16: Log documentation
    "records-MG16-0": "Log documentation describes each log source, field definitions, retention policy, and access control in a central log catalogue.",
    # =========================================================================
    # EU AI ACT — Robustness (Article 15)
    # =========================================================================
    # MG01: Robustness testing
    "robustness-MG01-0": "Robustness testing subjects the system to degraded images, adversarial inputs, and edge cases quarterly, covering 200+ test scenarios.",
    # MG02: Stress testing
    "robustness-MG02-0": "Stress tests simulate 3x peak load (6,000 concurrent authentications) to verify system stability under extreme conditions.",
    # MG03: Edge case handling
    "robustness-MG03-0": "Edge cases including twins, significant weight change, facial surgery, and heavy cosmetics are tested with documented handling procedures.",
    # MG04: Environmental robustness
    "robustness-MG04-0": "System performance is validated across lighting conditions from 50 to 2,000 lux using supplementary IR illumination for low-light scenarios.",
    # MG05: Data quality robustness
    "robustness-MG05-0": "The system handles low-quality inputs gracefully, requesting re-capture when image quality falls below the minimum threshold.",
    # MG06: Adversarial robustness
    "robustness-MG06-0": "Anti-spoofing measures including 3D depth sensing and liveness detection resist printed photos, screen replay, and 3D mask attacks.",
    # MG07: Fail-safe mechanisms
    "robustness-MG07-0": "On system failure, access points default to badge-only mode, ensuring building security is maintained without biometric processing.",
    # MG08: Graceful degradation
    "robustness-MG08-0": "If recognition confidence is marginal, the system prompts a second capture attempt before falling back to badge verification.",
    # MG09: Recovery procedures
    "robustness-MG09-0": "Automated recovery restarts failed recognition services within 60 seconds; full system recovery from backup completes within four hours.",
    # MG10: Input validation
    "robustness-MG10-0": "Input validation rejects non-facial images, oversized payloads, and malformed data before processing reaches the recognition engine.",
    # MG11: Output validation
    "robustness-MG11-0": "Output validation ensures access decisions are binary (grant/deny) with valid confidence scores; anomalous outputs trigger system alerts.",
    # MG12: Redundancy
    "robustness-MG12-0": "Redundant recognition servers operate in active-active mode across two on-premises clusters with automatic failover within 5 seconds.",
    # MG13: Monitoring for drift
    "robustness-MG13-0": "Model performance drift is monitored weekly by comparing production accuracy against the baseline established during validation.",
    # MG14: Update robustness
    "robustness-MG14-0": "Model updates follow blue-green deployment with automated rollback if post-deployment accuracy drops below the acceptance threshold.",
    # MG15: Third-party robustness
    "robustness-MG15-0": "Third-party component robustness is verified through vendor SLA monitoring and independent integration testing at each update.",
    # MG16: Robustness documentation
    "robustness-MG16-0": "Robustness test plans, results, and identified limitations are documented in the technical file and updated with each major release.",
    # =========================================================================
    # EU AI ACT — Oversight (Article 14)
    # =========================================================================
    # MG01: Human oversight design
    "oversight-MG01-0": "The system is designed for human-on-the-loop oversight; security operators monitor real-time dashboards showing all access decisions.",
    "oversight-MG01-1": "Oversight requirements were defined during system design with input from security managers and the works council.",
    "oversight-MG01-2": "The oversight model is documented in the technical file and reviewed annually for adequacy.",
    # MG02: Override capabilities
    "oversight-MG02-0": "Security operators can manually grant or deny access at any entry point, overriding the automated recognition decision.",
    "oversight-MG02-1": "Override actions are logged with the operator's ID, reason code, and timestamp for audit trail purposes.",
    "oversight-MG02-2": "Override procedures are tested monthly to verify that manual controls function correctly during system operation.",
    # MG03: Monitoring interface
    "oversight-MG03-0": "A dedicated monitoring interface displays real-time recognition events, confidence scores, system health, and alert status.",
    "oversight-MG03-1": "The interface highlights low-confidence decisions and flagged events requiring operator attention through colour-coded alerts.",
    # MG04: Alert systems
    "oversight-MG04-0": "Automated alerts notify operators of system failures, accuracy anomalies, multiple failed recognition attempts, and potential spoofing.",
    # MG05: Training for overseers
    "oversight-MG05-0": "Security operators complete 16 hours of oversight training covering system capabilities, limitations, bias risks, and override procedures.",
    "oversight-MG05-1": "Training includes scenario-based exercises simulating spoofing attempts, system failures, and discriminatory outcomes.",
    # MG06: Oversight documentation
    "oversight-MG06-0": "Oversight procedures, roles, and responsibilities are documented in the operator handbook and referenced in the technical file.",
    # MG07: Escalation procedures
    "oversight-MG07-0": "Escalation procedures define when operators must involve supervisors, the DPO, or emergency services based on event severity.",
    # MG08: Oversight effectiveness review
    "oversight-MG08-0": "Oversight effectiveness is reviewed biannually, measuring operator intervention rates, response times, and override accuracy.",
    # =========================================================================
    # EU AI ACT — Transparency (Article 13)
    # =========================================================================
    # MG01: User notification
    "transparency-MG01-0": "Clear signage at every entry point informs individuals that facial recognition is in use, displaying the data controller's identity and purpose.",
    "transparency-MG01-1": "New employees are notified in writing during onboarding about the facial recognition system, its purpose, and their rights.",
    # MG02: System capabilities
    "transparency-MG02-0": "Documentation provided to employees describes the system's ability to verify identity in under one second with a 99.7% accuracy rate.",
    "transparency-MG02-1": "Capabilities documentation is available on the company intranet and summarised in the employee handbook.",
    # MG03: Limitations disclosure
    "transparency-MG03-0": "Known limitations including reduced accuracy with heavy facial coverings and sensitivity to extreme lighting are disclosed to employees.",
    "transparency-MG03-1": "Limitations are communicated during onboarding and updated whenever new limitations are identified through testing.",
    # MG04: Decision explanation
    "transparency-MG04-0": "Employees who are denied access can request an explanation of the decision, including whether it was due to low confidence or no match.",
    "transparency-MG04-1": "Explanation procedures are documented in the employee handbook and accessible via the HR portal.",
    # MG05: Data usage transparency
    "transparency-MG05-0": "The privacy notice details what biometric data is collected, how it is processed, stored, and when it is deleted.",
    "transparency-MG05-1": "Data usage information is provided in layered format: concise signage, summary notice, and full privacy policy.",
    # MG06: Purpose communication
    "transparency-MG06-0": "The system's sole purpose — employee identity verification for building access — is clearly stated in all communications.",
    "transparency-MG06-1": "Purpose limitation is reinforced by technical controls preventing use of the system for any secondary purpose such as tracking.",
    # MG07: Risk communication
    "transparency-MG07-0": "A risk summary is shared with the works council describing potential risks to employees and the mitigations in place.",
    "transparency-MG07-1": "Risk communication is updated annually and whenever the risk profile changes materially.",
    # MG08: Contact information
    "transparency-MG08-0": "Contact details for the DPO and the AI system operator are displayed at entry points and in all system-related communications.",
    "transparency-MG08-1": "A dedicated email address and phone line are available for employees to raise concerns about the facial recognition system.",
    # MG09: Complaint mechanisms
    "transparency-MG09-0": "Employees can file complaints about the system via an online form, email, or in person with security management or the DPO.",
    # MG10: Update communication
    "transparency-MG10-0": "System updates including model changes, threshold adjustments, and new features are communicated to employees 14 days before deployment.",
    # MG11: Accessibility
    "transparency-MG11-0": "All transparency materials are available in accessible formats including large print and screen-reader-compatible digital documents.",
    # MG12: Multi-language support
    "transparency-MG12-0": "Transparency materials are available in the official languages of each country where the system is deployed.",
    # MG13: Technical documentation
    "transparency-MG13-0": "Technical documentation meeting EU AI Act Annex IV requirements is maintained and available to market surveillance authorities on request.",
    # MG14: Regulatory disclosure
    "transparency-MG14-0": "The system is registered in the EU AI database as a high-risk system with all required information fields completed.",
    # MG15: Third-party transparency
    "transparency-MG15-0": "Third-party components including the recognition algorithm vendor and camera supplier are disclosed in the technical documentation.",
    # MG16: Transparency review
    "transparency-MG16-0": "Transparency measures are reviewed annually for completeness and effectiveness, incorporating employee feedback and regulatory guidance.",
    # =========================================================================
    # EU AI ACT — Surveillance (Article 72)
    # =========================================================================
    # MG01: Surveillance plan
    "surveillance-MG01-0": "A post-market surveillance plan defines monitoring activities, data sources, and reporting obligations for the facial recognition system.",
    "surveillance-MG01-1": "The plan covers a five-year period aligned with the system's expected operational life and is reviewed annually.",
    # MG02: Monitoring indicators
    "surveillance-MG02-0": "Key monitoring indicators include FAR, FRR, system availability, average recognition latency, and complaint volume per site.",
    "surveillance-MG02-1": "Indicator thresholds are defined with amber and red alert levels triggering graduated response actions.",
    "surveillance-MG02-2": "New indicators are added as emerging risks are identified through horizon scanning and incident analysis.",
    # MG03: Data collection
    "surveillance-MG03-0": "Surveillance data is collected automatically from system logs, performance monitors, and the complaint management system.",
    "surveillance-MG03-1": "Manual data collection supplements automated sources through quarterly operator interviews and site inspection reports.",
    "surveillance-MG03-2": "Data collection procedures comply with GDPR; only aggregated, non-identifiable data is used for surveillance analysis.",
    # MG04: Incident tracking
    "surveillance-MG04-0": "All incidents are tracked in the incident management system with severity classification, root cause, and corrective action status.",
    "surveillance-MG04-1": "Incident trends are analysed quarterly to identify systemic issues requiring design changes or procedural updates.",
    "surveillance-MG04-2": "Serious incidents meeting Article 73 criteria are flagged automatically for regulatory reporting within the prescribed timeframe.",
    # MG05: Performance trends
    "surveillance-MG05-0": "Monthly performance trend reports track accuracy, latency, and availability metrics with 12-month rolling comparisons.",
    "surveillance-MG05-1": "Trend analysis uses statistical process control to distinguish between normal variation and significant performance shifts.",
    # MG06: User feedback
    "surveillance-MG06-0": "Employee feedback on the facial recognition system is collected via annual surveys and the ongoing complaint mechanism.",
    # MG07: Regulatory updates
    "surveillance-MG07-0": "The compliance team monitors EU AI Act delegated acts, harmonised standards, and guidance documents from the AI Office.",
    "surveillance-MG07-1": "Regulatory updates are assessed for impact within 30 days and integrated into the surveillance plan if relevant.",
    "surveillance-MG07-2": "A regulatory change log records each update, its impact assessment, and the resulting actions taken.",
    # MG08: Corrective actions
    "surveillance-MG08-0": "Surveillance findings triggering corrective action are managed through the CAPA process with defined timelines and verification steps.",
    "surveillance-MG08-1": "Corrective actions resulting from surveillance are prioritised based on risk severity and fundamental rights impact.",
    # MG09: Reporting schedule
    "surveillance-MG09-0": "Surveillance reports are produced monthly for operational review and quarterly for management and regulatory compliance purposes.",
    "surveillance-MG09-1": "Annual surveillance summary reports are submitted to the notified body and made available to market surveillance authorities.",
    "surveillance-MG09-2": "Ad-hoc reports are generated within 72 hours of any serious incident or significant performance deviation.",
    # MG10: Stakeholder communication
    "surveillance-MG10-0": "Surveillance findings are communicated to building management, the works council, and employee representatives quarterly.",
    "surveillance-MG10-1": "The DPO receives monthly surveillance summaries with specific focus on privacy-related indicators and complaints.",
    # MG11: Continuous improvement
    "surveillance-MG11-0": "Surveillance data drives continuous improvement initiatives including model updates, threshold tuning, and process refinements.",
    "surveillance-MG11-1": "Improvement initiatives resulting from surveillance are tracked in the quality improvement register with measurable success criteria.",
    # MG12: Resource allocation
    "surveillance-MG12-0": "Dedicated resources for post-market surveillance include two full-time analysts, monitoring infrastructure, and an annual testing budget.",
    "surveillance-MG12-1": "Resource adequacy is reviewed annually during budget planning and adjusted based on deployment scale and findings volume.",
    # MG13: Plan review
    "surveillance-MG13-0": "The surveillance plan is reviewed annually and following any serious incident, regulatory change, or new site deployment.",
    # =========================================================================
    "accuracy-MG06-2": "Confidence thresholds of 85% (advisory alert) and 70% (mandatory manual review) trigger real-time notifications to security operators.",
    "accuracy-MG07-2": "Failure conditions include lighting below 50 lux, facial occlusion exceeding 30%, and camera sensor degradation; each triggers defined fallback protocols.",
    "accuracy-MG08-2": "A formal change communication procedure notifies security teams of all accuracy threshold adjustments and model updates within 24 hours via the internal bulletin.",
    "accuracy-MG10-2": "Security operators complete mandatory training on interpreting confidence scores, understanding false match rates, and responding to threshold alerts.",
    "accuracy-MG11-2": "Monthly accuracy trend analysis feeds into the model improvement pipeline; persistent accuracy drops below thresholds trigger retraining with updated data.",
    "accuracy-MG12-2": "Minimum significance criteria require at least 500 match attempts per demographic subgroup before accuracy metrics are considered statistically valid.",
    "accuracy-MG13-2": "Internal benchmarks compare system accuracy against manual badge-based verification rates over the same period, with statistical significance explained in each report.",
    "accuracy-MG13-3": "Benchmark comparison methodology, sample sizes, and results are documented in the quarterly accuracy report with full statistical detail.",
    "data-governance-MG18-2": "Automated deletion scripts verify data removal from all storage locations including primary database, backups, and edge device caches.",
    "data-governance-MG18-3": "A technical assessment confirms that model weights do not allow reconstruction of individual facial templates from the trained model.",
    "data-governance-MG18-4": "Data deletion assessments verify that biometric data holds no cultural or historical significance that would warrant archival before destruction.",
    "data-governance-MG18-5": "A comprehensive deletion report documents the scope, method, verification steps, and timestamp of each data deletion operation.",
    "oversight-MG01-3": "The system maintains immutable access decision logs per Article 12, stored for a minimum of six months with tamper-evident protections.",
    "oversight-MG01-4": "Transparency mechanisms per Article 13 include visible signage at entry points and digital notifications explaining the facial recognition process.",
    "oversight-MG01-5": "Accuracy mechanisms per Article 15 include continuous monitoring dashboards showing false accept and false reject rates by demographic group.",
    "oversight-MG01-6": "Robustness mechanisms per Article 15 include automated environmental monitoring and graceful degradation to badge-based access during adverse conditions.",
    "oversight-MG01-7": "Cybersecurity mechanisms per Article 15 include network segmentation, encrypted biometric storage, and continuous vulnerability scanning.",
    "oversight-MG02-3": "The operator dashboard provides a records management interface for querying, exporting, and auditing access decision logs.",
    "oversight-MG02-4": "A transparency management interface allows operators to configure user notification content and update signage requirements.",
    "oversight-MG02-5": "The accuracy management interface displays real-time accuracy metrics and allows threshold configuration with audit trails.",
    "oversight-MG02-6": "The robustness management interface shows sensor health status and allows manual activation of fallback access modes.",
    "oversight-MG02-7": "The cybersecurity management interface provides vulnerability scan results and security patch status with one-click remediation options.",
    "risk-management-MG01-2": "Senior leadership has formally endorsed the risk management framework through a signed policy document allocating dedicated resources and authority.",
    "risk-management-MG11-2": "An implementation plan for each risk treatment measure includes timelines, responsible parties, resource requirements, and success criteria.",
    "risk-management-MG12-2": "Testing procedures for Article 9 compliance include structured test plans verifying each high-risk requirement is met before deployment.",
    "risk-management-MG12-3": "Real-world condition tests are conducted in pilot sites with representative employee populations before full deployment rollout.",
    "risk-management-MG14-2": "The complete risk management process — from identification through treatment to monitoring — is documented in the risk management dossier.",
    "transparency-MG03-2": "An operational monitoring procedure detects and alerts on any use of the system outside documented intended purposes, with automated blocking capabilities.",
    "transparency-MG05-2": "The system provides per-decision explanations showing the confidence score, matched template reference, and contributing facial features used.",
    "transparency-MG06-2": "Plain-language explanations of each access decision are available to employees via the self-service portal in their preferred language.",
    # UNDP HUMAN RIGHTS ASSESSMENT — Phase 0: Zero Questions
    # =========================================================================
    "undp-zero-question-ZQ-01-0": "An alternatives analysis confirmed that facial recognition provides faster, more hygienic access than badges while reducing tailgating risks.",
    "undp-zero-question-ZQ-02-0": "The rationale for choosing AI-based biometric verification is documented, citing security improvement and contactless access requirements.",
    "undp-zero-question-ZQ-03-0": "A SWOT analysis identified strengths (speed, security), weaknesses (bias risk), opportunities (multi-site scaling), and threats (regulatory changes).",
    "undp-zero-question-ZQ-04-0": "A fundamental rights impact assessment confirmed compatibility, subject to explicit consent, non-discrimination testing, and opt-out alternatives.",
    # =========================================================================
    # UNDP HUMAN RIGHTS ASSESSMENT — Phase 1: Readiness (OR-01 to OR-28)
    # =========================================================================
    "undp-org-readiness-OR-01-0": "A human rights policy explicitly addresses biometric data processing and commits to non-discrimination in automated access decisions.",
    "undp-org-readiness-OR-02-0": "The CISO and DPO jointly sponsor the project with board-level endorsement documented in the project charter.",
    "undp-org-readiness-OR-03-0": "Employees can report concerns about the facial recognition system through an anonymous ethics hotline and a dedicated email channel.",
    "undp-org-readiness-OR-04-0": "The human rights policy is reviewed annually and updated to reflect new regulatory requirements and deployment learnings.",
    "undp-org-readiness-OR-05-0": "Cross-departmental collaboration involves IT, legal, HR, facilities, and the works council in system governance.",
    "undp-org-readiness-OR-06-0": "Stakeholder engagement includes employee representatives, building management, the DPO, and external civil liberties advisors.",
    "undp-org-readiness-OR-07-0": "Dedicated budget covers bias testing, independent audits, alternative access infrastructure, and ongoing compliance activities.",
    "undp-org-readiness-OR-08-0": "The DPIA summary and system purpose description are published on the company intranet for all employees.",
    "undp-org-readiness-OR-09-0": "Senior management received a briefing on biometric AI risks, EU AI Act obligations, and fundamental rights implications.",
    "undp-org-readiness-OR-10-0": "All security operators and HR staff complete mandatory training on biometric system ethics, bias, and data protection.",
    "undp-org-readiness-OR-11-0": "A designated AI ethics lead oversees human rights compliance for the facial recognition system full-time.",
    "undp-org-readiness-OR-12-0": "External expertise from a biometric testing laboratory and a data protection consultancy supports validation and compliance.",
    "undp-org-readiness-OR-13-0": "Whistleblower protection covers employees reporting concerns about discriminatory system behaviour without fear of retaliation.",
    "undp-org-readiness-OR-14-0": "Employee and works council feedback from pilot deployments informed the final system design and operating procedures.",
    "undp-org-readiness-OR-15-0": "In-house legal counsel specialising in AI regulation and data protection law advises on EU AI Act and GDPR compliance.",
    "undp-org-readiness-OR-16-0": "Best practices from NIST FRVT reports and EU EDPB guidelines on facial recognition are incorporated into system design.",
    "undp-org-readiness-OR-17-0": "The organisation participates in EU AI standardisation working groups and biometric industry associations.",
    "undp-org-readiness-OR-18-0": "A skills gap assessment identified the need for bias testing expertise and adversarial ML knowledge, addressed through targeted hiring.",
    "undp-org-readiness-OR-19-0": "A structured impact assessment process is followed before each new site deployment, covering local legal and demographic factors.",
    "undp-org-readiness-OR-20-0": "An independent third-party auditor evaluates the system's fairness and accuracy biennially using NIST FRVT methodology.",
    "undp-org-readiness-OR-21-0": "Risk identification covers discrimination, privacy intrusion, exclusion of disabled persons, and chilling effects on employees.",
    "undp-org-readiness-OR-22-0": "Community engagement at each site includes information sessions with employee representatives and building tenant associations.",
    "undp-org-readiness-OR-23-0": "Pre-deployment assessments at each site evaluate local demographics, lighting conditions, and employee accessibility needs.",
    "undp-org-readiness-OR-24-0": "Data security protocols include encryption, access control, network segmentation, and regular penetration testing of biometric stores.",
    "undp-org-readiness-OR-25-0": "The compliance team monitors EU AI Act implementing acts, EDPB opinions, and national supervisory authority guidance monthly.",
    "undp-org-readiness-OR-26-0": "A human oversight process requires security operators to monitor all access decisions and intervene when alerts are raised.",
    "undp-org-readiness-OR-27-0": "Failure mitigation includes badge-based fallback access, manual override capability, and a 60-second automated recovery procedure.",
    "undp-org-readiness-OR-28-0": "A redress mechanism allows employees to contest access denials, request data review, and obtain re-enrolment within 48 hours.",
    # =========================================================================
    # UNDP HUMAN RIGHTS ASSESSMENT — Phase 2: Planning (PS-01 to PS-19)
    # =========================================================================
    "undp-planning-PS-01-0": "The system's purpose is to authenticate employees via facial recognition for secure, contactless building access at EU office sites.",
    "undp-planning-PS-02-0": "Technical characteristics include a CNN-based face embedding model, IR-depth liveness detection, and sub-second 1:N matching.",
    "undp-planning-PS-03-0": "The system is deployed across EU member states; each jurisdiction's data protection requirements are mapped and addressed.",
    "undp-planning-PS-04-0": "Data types processed include facial images, biometric templates, employee IDs, timestamps, and access decision outcomes.",
    "undp-planning-PS-05-0": "Data flow mapping documents the path from camera capture to edge processing, central matching, decision output, and log storage.",
    "undp-planning-PS-06-0": "Affected individuals are approximately 2,000 employees per site, plus visitors who encounter signage but are not enrolled.",
    "undp-planning-PS-07-0": "Vulnerable groups identified include employees with disabilities, facial differences, and those with religious face coverings.",
    "undp-planning-PS-08-0": "Duty-bearers include the deploying organisation, the recognition algorithm provider, and the camera hardware manufacturer.",
    "undp-planning-PS-09-0": "The responsibility chain is documented from data controller (employer) through processor (IT operations) to sub-processors (vendors).",
    "undp-planning-PS-10-0": "Existing policies on physical security, data protection, and workplace surveillance were reviewed for compatibility.",
    "undp-planning-PS-11-0": "The DPIA conducted under GDPR Article 35 was reviewed and its findings incorporated into this human rights assessment.",
    "undp-planning-PS-12-0": "Affected groups consulted include employee representatives, trade unions, accessibility advocates, and building security staff.",
    "undp-planning-PS-13-0": "Relevant stakeholders include the national data protection authority, the works council, and the AI ethics advisory board.",
    "undp-planning-PS-14-0": "Additional duty-bearers identified include site facility managers and the outsourced security services provider.",
    "undp-planning-PS-15-0": "Supply chain assessment covers the camera manufacturer, recognition SDK provider, and cloud infrastructure vendor.",
    "undp-planning-PS-16-0": "The recognition algorithm vendor's human rights impact has been assessed; no adverse findings were identified.",
    "undp-planning-PS-17-0": "Supplier contracts include human rights and non-discrimination clauses aligned with the UN Guiding Principles.",
    "undp-planning-PS-18-0": "The DPIA summary and purpose limitation statement are published on the company intranet and accessible to all employees.",
    "undp-planning-PS-19-0": "Staff training covers system purpose, employee rights, bias awareness, and escalation procedures for rights concerns.",
    # =========================================================================
    # UNDP HUMAN RIGHTS ASSESSMENT — Phase 2.3: Rights Mapping (HRM-01 to HRM-36)
    # =========================================================================
    "undp-rights-mapping-HRM-01-0": "Relevant rights identified include privacy, non-discrimination, freedom of movement, human dignity, and data protection.",
    "undp-rights-mapping-HRM-02-0": "Human dignity is protected by voluntary enrolment, respectful signage, and prohibition of covert biometric capture.",
    "undp-rights-mapping-HRM-03-0": "Freedom from discrimination is ensured through demographic accuracy testing and maximum FRR variance of 0.5% across groups.",
    "undp-rights-mapping-HRM-04-0": "Right to life is not directly impacted; the system controls building access only and has no safety-critical function.",
    "undp-rights-mapping-HRM-05-0": "Freedom from slavery is not directly impacted; the system is not used for labour monitoring or coercive purposes.",
    "undp-rights-mapping-HRM-06-0": "Freedom from inhuman treatment is protected by ensuring the system does not subject employees to degrading verification procedures.",
    "undp-rights-mapping-HRM-07-0": "Right to privacy is addressed through data minimisation, purpose limitation, retention limits, and the DPIA.",
    "undp-rights-mapping-HRM-08-0": "Right to own property is not directly impacted by the facial recognition access control system.",
    "undp-rights-mapping-HRM-09-0": "Freedom of thought is not directly impacted; the system does not analyse expressions, emotions, or cognitive states.",
    "undp-rights-mapping-HRM-10-0": "Freedom of expression is safeguarded; the system does not monitor or restrict employee communications or visible opinions.",
    "undp-rights-mapping-HRM-11-0": "Freedom of movement within the building is preserved; the system only authenticates at entry points and does not track internal movement.",
    "undp-rights-mapping-HRM-12-0": "Freedom of assembly is not restricted; the system does not monitor gatherings or group activities within the building.",
    "undp-rights-mapping-HRM-13-0": "Freedom of association is not impacted; no data about employee associations or affiliations is collected or inferred.",
    "undp-rights-mapping-HRM-14-0": "Right to marriage and family is not directly impacted by the facial recognition access control system.",
    "undp-rights-mapping-HRM-15-0": "Adequate standard of living is not directly impacted; the system does not affect employment terms or conditions.",
    "undp-rights-mapping-HRM-16-0": "Right to education is not directly impacted; the system is deployed in office buildings, not educational institutions.",
    "undp-rights-mapping-HRM-17-0": "Right to social security is not impacted; access decisions are not linked to social security status or benefits.",
    "undp-rights-mapping-HRM-18-0": "Right to participate in cultural and scientific life is not directly impacted by the access control system.",
    "undp-rights-mapping-HRM-19-0": "Right to work is protected through fallback access ensuring no employee is denied workplace entry due to system errors.",
    "undp-rights-mapping-HRM-20-0": "Right to leisure is not directly impacted; the system operates at building entry points and does not monitor break times.",
    "undp-rights-mapping-HRM-21-0": "Minority rights are protected through equitable accuracy across ethnic groups and availability of alternative access methods.",
    "undp-rights-mapping-HRM-22-0": "Rights of children are not applicable; the system is deployed in adult-only corporate office environments.",
    "undp-rights-mapping-HRM-23-0": "Freedom from torture is not directly impacted by the access control system; no coercive use is permitted.",
    "undp-rights-mapping-HRM-24-0": "Recognition before law is not impacted; the system performs identity verification, not legal status determination.",
    "undp-rights-mapping-HRM-25-0": "Equality before law is supported by demonstrably equal recognition performance across all demographic groups.",
    "undp-rights-mapping-HRM-26-0": "Access to justice is ensured through the complaint mechanism, DPO contact, and the right to lodge a complaint with the supervisory authority.",
    "undp-rights-mapping-HRM-27-0": "Freedom from arbitrary detention is not applicable; incorrect access denial does not constitute detention and fallback access is available.",
    "undp-rights-mapping-HRM-28-0": "Right to fair trial is not directly impacted; access decisions are not judicial in nature and are contestable.",
    "undp-rights-mapping-HRM-29-0": "Presumption of innocence is respected; denied access does not imply wrongdoing and employees can request immediate manual verification.",
    "undp-rights-mapping-HRM-30-0": "Right to legal recourse is preserved through internal complaint procedures and external recourse to the data protection authority.",
    "undp-rights-mapping-HRM-31-0": "Right to asylum is not applicable to this corporate employee access control deployment.",
    "undp-rights-mapping-HRM-32-0": "Right to nationality is not impacted; the system authenticates based on enrolment, not nationality or citizenship status.",
    "undp-rights-mapping-HRM-33-0": "Public affairs participation is not impacted; the system does not process political opinions or restrict civic engagement.",
    "undp-rights-mapping-HRM-34-0": "Relevant legal instruments include GDPR, EU AI Act, the EU Charter of Fundamental Rights, and national data protection laws.",
    "undp-rights-mapping-HRM-35-0": "Relevant oversight bodies include the national DPA, the AI Office, and internal bodies such as the works council and ethics board.",
    "undp-rights-mapping-HRM-36-0": "EDPB guidelines on facial recognition in the workplace and CJEU biometric data rulings have been reviewed and incorporated.",
    # =========================================================================
    # UNDP HUMAN RIGHTS ASSESSMENT — Phase 3: Due Diligence (DD-01 to DD-22)
    # =========================================================================
    "undp-data-diligence-DD-01-0": "Training data originates from consented employee enrolment images and licensed academic face datasets with documented provenance.",
    "undp-data-diligence-DD-02-0": "Explicit informed consent is obtained from each employee during enrolment, with a clear explanation of data usage and retention.",
    "undp-data-diligence-DD-03-0": "Training data diversity covers age, gender, ethnicity, and facial features representative of the European employee population.",
    "undp-data-diligence-DD-04-0": "Bias analysis is performed on training data using demographic parity and equalised odds metrics, with documented results.",
    "undp-data-diligence-DD-05-0": "Sensitive biometric data is protected through encryption, access controls, and strict purpose limitation as required by GDPR Article 9.",
    "undp-data-diligence-DD-06-0": "Data labelling is limited to employee ID and enrolment metadata; no demographic labels are attached to biometric data.",
    "undp-data-diligence-DD-07-0": "The training objective is to minimise embedding distance for genuine pairs while maximising it for impostor pairs across all demographic groups.",
    "undp-data-diligence-DD-08-0": "Fairness criteria require that FRR variance across demographic subgroups does not exceed 0.5 percentage points.",
    "undp-data-diligence-DD-09-0": "Known limitations include reduced accuracy with heavy face coverings, significant cosmetic changes, and extreme lighting conditions.",
    "undp-data-diligence-DD-10-0": "The model uses a ResNet-based architecture with ArcFace loss for face embedding extraction, documented in the model card.",
    "undp-data-diligence-DD-11-0": "Performance is measured using TAR at fixed FAR thresholds across the full test set and each demographic subgroup.",
    "undp-data-diligence-DD-12-0": "Subgroup performance analysis confirms that no demographic group has a FRR exceeding 1.5% or FAR exceeding 0.05%.",
    "undp-data-diligence-DD-13-0": "A model card documents the architecture, training data, performance metrics, limitations, and intended use conditions.",
    "undp-data-diligence-DD-14-0": "Decision explainability shows which facial regions contributed most to the match score, available to operators upon request.",
    "undp-data-diligence-DD-15-0": "Security operators provide human oversight with the ability to override any automated access decision in real time.",
    "undp-data-diligence-DD-16-0": "Post-deployment monitoring tracks accuracy, fairness metrics, and complaint rates continuously with automated alerting.",
    "undp-data-diligence-DD-17-0": "A feedback and complaints mechanism allows employees to report recognition failures, privacy concerns, or discrimination.",
    "undp-data-diligence-DD-18-0": "Input testing covers image quality variations, lighting conditions, facial accessories, and ageing effects.",
    "undp-data-diligence-DD-19-0": "Bias probing tests the system with balanced demographic test sets to detect differential performance across groups.",
    "undp-data-diligence-DD-20-0": "Functionality testing verifies end-to-end operation from camera capture through matching to gate actuation at each site.",
    "undp-data-diligence-DD-21-0": "Accessibility is ensured through alternative badge-based entry for employees unable to use facial recognition due to disability.",
    "undp-data-diligence-DD-22-0": "Output review confirms that access decisions are binary, confidence scores are well-calibrated, and no extraneous data is disclosed.",
    # =========================================================================
    # UNDP HUMAN RIGHTS ASSESSMENT — Phase 4: Analysis (RA-01 to RA-12)
    # =========================================================================
    "undp-risk-analysis-RA-01-0": "The probability of discriminatory impact is assessed as low based on validated subgroup accuracy within 0.5% FRR variance.",
    "undp-risk-analysis-RA-02-0": "Exposure assessment identifies approximately 2,000 employees per site using the system daily for building access.",
    "undp-risk-analysis-RA-03-0": "Overall likelihood of rights impact is rated as medium due to the inherent sensitivity of biometric data processing.",
    "undp-risk-analysis-RA-04-0": "Gravity of potential prejudice is rated high if discrimination occurs, as it could deny workplace access to specific groups.",
    "undp-risk-analysis-RA-05-0": "Effort to overcome harm is rated moderate; affected employees can use fallback access and file complaints for resolution.",
    "undp-risk-analysis-RA-06-0": "Overall severity is rated as significant, requiring robust mitigations including bias testing, opt-out options, and human oversight.",
    "undp-risk-analysis-RA-07-0": "The risk index combines likelihood and severity, placing the system in the high-attention category requiring ongoing monitoring.",
    "undp-risk-analysis-RA-08-0": "Impact visualisation uses a heat map showing risk levels across different rights categories, shared with the governance board.",
    "undp-risk-analysis-RA-09-0": "An independent assessor reviewed the rights impact analysis and confirmed the methodology and conclusions are sound.",
    "undp-risk-analysis-RA-10-0": "No rights impacts can be excluded a priori; all identified rights have been assessed even where impact is minimal.",
    "undp-risk-analysis-RA-11-0": "The balancing test weighs security benefits and contactless hygiene against privacy intrusion and discrimination risk.",
    "undp-risk-analysis-RA-12-0": "Benefits analysis documents improved security, reduced tailgating, faster throughput, and contactless entry as system benefits.",
    # =========================================================================
    # UNDP HUMAN RIGHTS ASSESSMENT — Phase 5: Management (RMG-01 to RMG-15)
    # =========================================================================
    "undp-risk-management-RMG-01-0": "Mitigation measures include demographic accuracy testing, opt-out badge access, liveness detection, and human override capability.",
    "undp-risk-management-RMG-02-0": "Measures are contextualised per site, accounting for local demographics, lighting conditions, and employee accessibility needs.",
    "undp-risk-management-RMG-03-0": "Post-mitigation likelihood is reduced to low; severity remains moderate due to the inherent sensitivity of biometric processing.",
    "undp-risk-management-RMG-04-0": "Implementation timeline schedules all mitigations before go-live, with bias testing completed minimum 30 days before deployment.",
    "undp-risk-management-RMG-05-0": "Responsibility for each mitigation is assigned to named individuals with clear accountability and escalation paths.",
    "undp-risk-management-RMG-06-0": "Residual risk is re-assessed after all mitigations are implemented, using the same methodology as the initial assessment.",
    "undp-risk-management-RMG-07-0": "Residual likelihood of discriminatory impact is rated low, validated by subgroup testing showing FRR variance below 0.5%.",
    "undp-risk-management-RMG-08-0": "Residual severity remains moderate due to the inherent sensitivity of biometric data, even with strong mitigations in place.",
    "undp-risk-management-RMG-09-0": "Residual impact is documented as acceptable given the mitigations, opt-out options, and continuous monitoring commitments.",
    "undp-risk-management-RMG-10-0": "Acceptability assessment concludes the residual risk is acceptable, subject to ongoing monitoring and annual reassessment.",
    "undp-risk-management-RMG-11-0": "Procedures define system suspension if persistent high risk is identified that cannot be mitigated through available measures.",
    "undp-risk-management-RMG-12-0": "All risk management decisions, including risk acceptance rationale, are documented and signed by the risk committee.",
    "undp-risk-management-RMG-13-0": "Scaling criteria require a new rights impact assessment before deployment at any site with more than 500 additional employees.",
    "undp-risk-management-RMG-14-0": "Stakeholder input from employee representatives and the works council is incorporated into mitigation design and prioritisation.",
    "undp-risk-management-RMG-15-0": "Mitigation effectiveness is documented through quarterly performance reports comparing actual metrics against mitigation targets.",
    # =========================================================================
    # UNDP HUMAN RIGHTS ASSESSMENT — Phase 6: Monitoring (MI-01 to MI-08)
    # =========================================================================
    "undp-monitoring-MI-01-0": "A monitoring plan tracks accuracy, fairness, complaint rates, and employee satisfaction with monthly and quarterly review cycles.",
    "undp-monitoring-MI-02-0": "Periodic re-assessment of human rights impact is conducted annually and after any significant system or deployment change.",
    "undp-monitoring-MI-03-0": "Drift detection monitors recognition accuracy and fairness metrics weekly, alerting on statistically significant deviations.",
    "undp-monitoring-MI-04-0": "Feedback channels include the complaint portal, anonymous hotline, employee surveys, and direct reporting to the DPO.",
    "undp-monitoring-MI-05-0": "A remedy mechanism provides re-enrolment, badge-based access, and formal investigation within 48 hours of a complaint.",
    "undp-monitoring-MI-06-0": "Re-assessment is triggered by accuracy drops exceeding 0.5%, more than five complaints per month, or regulatory changes.",
    "undp-monitoring-MI-07-0": "New regulatory requirements are assessed and incorporated into monitoring procedures within 60 days of publication.",
    "undp-monitoring-MI-08-0": "A feedback loop connects monitoring findings to the development team for model improvements and to management for governance decisions.",
    # =========================================================================
    # UNDP HUMAN RIGHTS ASSESSMENT — Phase 7: Alignment (FA-01 to FA-17)
    # =========================================================================
    "undp-framework-alignment-FA-01-0": "The state duty to protect human rights is acknowledged; the system complies with national implementing legislation of the EU AI Act.",
    "undp-framework-alignment-FA-02-0": "Corporate responsibility to respect human rights is fulfilled through the HRIA, DPIA, and ongoing mitigation and monitoring.",
    "undp-framework-alignment-FA-03-0": "Access to remedy is provided through the internal complaint mechanism, DPO contact, and external recourse to the national DPA.",
    "undp-framework-alignment-FA-04-0": "The system supports inclusive growth by ensuring equitable access performance across all employee demographic groups.",
    "undp-framework-alignment-FA-05-0": "Human-centred values are embedded through voluntary enrolment, opt-out alternatives, and transparency about system operation.",
    "undp-framework-alignment-FA-06-0": "Transparency and explainability are ensured through clear signage, privacy notices, and available decision explanations.",
    "undp-framework-alignment-FA-07-0": "Robustness and safety are validated through adversarial testing, anti-spoofing measures, and fail-safe badge fallback.",
    "undp-framework-alignment-FA-08-0": "Accountability is established through the RACI matrix, designated AI ethics lead, and documented governance structure.",
    "undp-framework-alignment-FA-09-0": "The system is classified as high-risk under EU AI Act Article 6, Annex III (biometric identification in public-accessible spaces).",
    "undp-framework-alignment-FA-10-0": "A fundamental rights impact assessment (FRIA) has been conducted and documented as required for high-risk AI systems.",
    "undp-framework-alignment-FA-11-0": "Data governance complies with EU AI Act Article 10 requirements for training data quality, relevance, and representativeness.",
    "undp-framework-alignment-FA-12-0": "Transparency obligations under Article 13 are met through user notifications, system documentation, and regulatory disclosures.",
    "undp-framework-alignment-FA-13-0": "Human oversight requirements under Article 14 are met through real-time operator monitoring and manual override capabilities.",
    "undp-framework-alignment-FA-14-0": "Technical documentation meeting Annex IV requirements is maintained and available to market surveillance authorities on request.",
    "undp-framework-alignment-FA-15-0": "The system is registered in the EU AI database with all required fields completed, including provider and deployer information.",
    "undp-framework-alignment-FA-16-0": "A Council of Europe HUDERIA-style assessment has been conducted, addressing human rights and democracy impacts.",
    "undp-framework-alignment-FA-17-0": "The system complies with the Council of Europe AI Convention provisions on transparency, oversight, and accountability.",
}
