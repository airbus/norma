import type { ChecklistArea } from './reporting-checklist';

export const UNDP_CHECKLIST: ChecklistArea[] = [
  {
    id: 'undp-zero-question',
    title: 'Zero Q.',
    article: 'Phase 0',
    items: [
      {
        code: 'ZQ-01',
        title: 'AI Necessity Assessment',
        questions: [
          'Has it been assessed whether an AI-based solution is actually necessary, or whether non-algorithmic alternatives could achieve the same goal? (CRITICAL)',
        ],
      },
      {
        code: 'ZQ-02',
        title: 'AI Rationale',
        questions: [
          'Has the rationale for choosing an AI-based approach over alternatives been documented?',
        ],
      },
      {
        code: 'ZQ-03',
        title: 'SWOT Analysis',
        questions: [
          'Has a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) of the AI approach vs. alternatives been conducted?',
        ],
      },
      {
        code: 'ZQ-04',
        title: 'Fundamental Rights Compatibility',
        questions: [
          'Has it been confirmed that the AI solution does not pursue an objective that is inherently incompatible with fundamental rights?',
        ],
      },
    ],
  },
  {
    id: 'undp-org-readiness',
    title: 'Readiness',
    article: 'Phase 1',
    items: [
      {
        code: 'OR-01',
        title: 'Human Rights Policy',
        questions: [
          'Does the organisation have a documented human rights policy covering AI design, development, and deployment?',
        ],
      },
      {
        code: 'OR-02',
        title: 'Leadership Support',
        questions: [
          'Does leadership actively support and resource human rights due diligence for AI initiatives?',
        ],
      },
      {
        code: 'OR-03',
        title: 'Reporting Channels',
        questions: [
          'Do dedicated channels exist for employees to report potential human rights issues related to AI systems?',
        ],
      },
      {
        code: 'OR-04',
        title: 'Policy Review',
        questions: [
          'Does the organisation regularly review and update policies to address emerging AI-related human rights issues?',
        ],
      },
      {
        code: 'OR-05',
        title: 'Cross-Departmental Collaboration',
        questions: ['Is cross-departmental collaboration on human rights in AI facilitated?'],
      },
      {
        code: 'OR-06',
        title: 'Stakeholder Engagement',
        questions: [
          'Does the organisation engage stakeholders (including affected communities) for input and feedback during the AI lifecycle?',
        ],
      },
      {
        code: 'OR-07',
        title: 'Resource Allocation',
        questions: [
          'Does the organisation allocate sufficient resources for training, risk assessments, and stakeholder engagement?',
        ],
      },
      {
        code: 'OR-08',
        title: 'Public Transparency',
        questions: [
          'Does the organisation prioritise transparency and communication with the public about AI use?',
        ],
      },
      {
        code: 'OR-09',
        title: 'Management Understanding',
        questions: [
          'Does the management team have comprehensive understanding of human rights implications of AI?',
        ],
      },
      {
        code: 'OR-10',
        title: 'Employee Training',
        questions: [
          'Do employees receive regular training on human rights and ethical considerations in AI?',
        ],
      },
      {
        code: 'OR-11',
        title: 'Designated Staff',
        questions: [
          'Are designated staff or teams responsible for monitoring and addressing human rights issues in AI projects?',
        ],
      },
      {
        code: 'OR-12',
        title: 'External Expertise',
        questions: ['Does the organisation collaborate with external human rights and AI experts?'],
      },
      {
        code: 'OR-13',
        title: 'Whistleblower Protection',
        questions: [
          'Are employees protected from retaliation when raising human rights concerns about AI?',
        ],
      },
      {
        code: 'OR-14',
        title: 'Feedback Incorporation',
        questions: [
          'Does a process exist for incorporating stakeholder feedback into AI practices?',
        ],
      },
      {
        code: 'OR-15',
        title: 'Legal Expertise',
        questions: ['Does the organisation have access to legal expertise on human rights and AI?'],
      },
      {
        code: 'OR-16',
        title: 'Best Practices Resources',
        questions: ['Are resources provided for employees to stay updated on best practices?'],
      },
      {
        code: 'OR-17',
        title: 'Industry Participation',
        questions: [
          'Does the organisation participate in industry groups or forums on human rights and AI?',
        ],
      },
      {
        code: 'OR-18',
        title: 'Skills Gap Assessment',
        questions: [
          'Does the organisation regularly assess and address AI-related human rights skill gaps?',
        ],
      },
      {
        code: 'OR-19',
        title: 'Impact Assessment Process',
        questions: [
          'Does a systematic human rights impact assessment process exist for all AI projects? (CRITICAL)',
        ],
      },
      {
        code: 'OR-20',
        title: 'Third-Party AI Evaluation',
        questions: [
          'Do procedures exist to evaluate human rights impacts of third-party AI systems integrated or utilised? (CRITICAL)',
        ],
      },
      {
        code: 'OR-21',
        title: 'Risk Identification',
        questions: [
          'Is a systematic risk identification process in place, including testing for reliability, accuracy, and resilience?',
        ],
      },
      {
        code: 'OR-22',
        title: 'Community Engagement',
        questions: [
          'Are stakeholders (including affected communities) engaged in the AI deployment process?',
        ],
      },
      {
        code: 'OR-23',
        title: 'Pre-Deployment Assessment',
        questions: [
          'Do all AI projects undergo human rights and data protection impact assessment before deployment? (CRITICAL)',
        ],
      },
      {
        code: 'OR-24',
        title: 'Data Security Protocols',
        questions: [
          'Are data security and privacy protocols established for all AI-related processes?',
        ],
      },
      {
        code: 'OR-25',
        title: 'Regulatory Updates',
        questions: [
          'Are processes regularly updated to incorporate new regulations and standards?',
        ],
      },
      {
        code: 'OR-26',
        title: 'Oversight Process',
        questions: [
          'Is an oversight process established to monitor AI system performance and compliance with human rights standards? (CRITICAL)',
        ],
      },
      {
        code: 'OR-27',
        title: 'Failure Mitigation',
        questions: [
          'Does the organisation have ability to mitigate and minimise negative effects from AI system failures?',
        ],
      },
      {
        code: 'OR-28',
        title: 'Redress Mechanism',
        questions: [
          'Is a redress mechanism in place for individuals adversely affected by AI systems? (CRITICAL)',
        ],
      },
    ],
  },
  {
    id: 'undp-planning',
    title: 'Planning',
    article: 'Phase 2',
    items: [
      {
        code: 'PS-01',
        title: 'System Purpose',
        questions: ['Has the main purpose of the AI system been documented? (CRITICAL)'],
      },
      {
        code: 'PS-02',
        title: 'Technical Characteristics',
        questions: [
          'Have the main technical characteristics of the system been documented (type of AI model, architecture)?',
        ],
      },
      {
        code: 'PS-03',
        title: 'Deployment Jurisdictions',
        questions: [
          'Have all countries/jurisdictions where the system will be deployed been identified?',
        ],
      },
      {
        code: 'PS-04',
        title: 'Data Types',
        questions: [
          'Have all types of data processed (personal, non-personal, special categories) for training and operation been identified? (CRITICAL)',
        ],
      },
      {
        code: 'PS-05',
        title: 'Data Flow Mapping',
        questions: [
          'Have all data flows been mapped — from collection through processing to storage and deletion?',
        ],
      },
      {
        code: 'PS-06',
        title: 'Affected Individuals',
        questions: [
          'Have all individuals or groups potentially affected by the AI system been identified? (CRITICAL)',
        ],
      },
      {
        code: 'PS-07',
        title: 'Vulnerable Groups',
        questions: [
          'Has it been assessed whether affected groups include vulnerable individuals or groups (children, minorities, persons with disabilities, etc.)?',
        ],
      },
      {
        code: 'PS-08',
        title: 'Duty-Bearers',
        questions: [
          'Have all duty-bearers been identified — who is involved in design, provision, and deployment, and what is their role? (CRITICAL)',
        ],
      },
      {
        code: 'PS-09',
        title: 'Responsibility Chain',
        questions: ['Has the chain of responsibility from developer to deployer been documented?'],
      },
      {
        code: 'PS-10',
        title: 'Existing Policies',
        questions: [
          'Have existing policies and procedures for assessing human rights impacts (including stakeholder engagement) been documented?',
        ],
      },
      {
        code: 'PS-11',
        title: 'Prior Impact Assessments',
        questions: [
          'Have any prior impact assessments been documented (e.g., Data Protection Impact Assessment, sector-specific assessments)?',
        ],
      },
      {
        code: 'PS-12',
        title: 'Affected Groups Identification',
        questions: [
          'Have all groups or communities potentially affected by the AI system (including during development) been identified? (CRITICAL)',
        ],
      },
      {
        code: 'PS-13',
        title: 'Relevant Stakeholders',
        questions: [
          'Have all relevant stakeholders to involve been identified (civil society, international organisations, experts, industry associations, journalists)?',
        ],
      },
      {
        code: 'PS-14',
        title: 'Additional Duty-Bearers',
        questions: [
          'Have additional duty-bearers beyond the AI provider and deployer been identified (national authorities, government agencies)?',
        ],
      },
      {
        code: 'PS-15',
        title: 'Supply Chain Assessment',
        questions: [
          'Has it been assessed whether business partners and suppliers (subcontractors of AI systems and datasets) have been involved in the assessment? (CRITICAL)',
        ],
      },
      {
        code: 'PS-16',
        title: 'Supplier Human Rights Impact',
        questions: [
          'Has the AI provider conducted a supply chain assessment for potential human rights impacts from suppliers/contractors? (CRITICAL)',
        ],
      },
      {
        code: 'PS-17',
        title: 'Supplier Standards',
        questions: [
          'Has the AI provider promoted human rights standards or audits among suppliers?',
        ],
      },
      {
        code: 'PS-18',
        title: 'Public Communication',
        questions: [
          'Do the AI provider and developers publicly communicate potential human rights impacts of the AI system?',
        ],
      },
      {
        code: 'PS-19',
        title: 'Staff Training',
        questions: [
          'Do the AI provider and developers provide training on human rights standards to management and procurement staff?',
        ],
      },
    ],
  },
  {
    id: 'undp-rights-mapping',
    title: 'Rights Mapping',
    article: 'Phase 2.3',
    items: [
      {
        code: 'HRM-01',
        title: 'Rights Identification',
        questions: [
          'Have all human rights potentially affected by the AI system been identified, using the comprehensive rights checklist? (CRITICAL)',
        ],
      },
      {
        code: 'HRM-02',
        title: 'Human Dignity',
        questions: ['Has the potential impact on human dignity been assessed?'],
      },
      {
        code: 'HRM-03',
        title: 'Freedom from Discrimination',
        questions: ['Has the potential impact on freedom from discrimination been assessed?'],
      },
      {
        code: 'HRM-04',
        title: 'Right to Life',
        questions: ['Has the potential impact on the right to life been assessed?'],
      },
      {
        code: 'HRM-05',
        title: 'Freedom from Slavery',
        questions: ['Has the potential impact on freedom from slavery been assessed?'],
      },
      {
        code: 'HRM-06',
        title: 'Freedom from Inhuman Treatment',
        questions: [
          'Has the potential impact on freedom from inhuman/degrading treatment been assessed?',
        ],
      },
      {
        code: 'HRM-07',
        title: 'Right to Privacy',
        questions: ['Has the potential impact on the right to privacy been assessed?'],
      },
      {
        code: 'HRM-08',
        title: 'Right to Own Property',
        questions: ['Has the potential impact on the right to own property been assessed?'],
      },
      {
        code: 'HRM-09',
        title: 'Freedom of Thought',
        questions: [
          'Has the potential impact on freedom of thought, conscience, and religion been assessed?',
        ],
      },
      {
        code: 'HRM-10',
        title: 'Freedom of Expression',
        questions: ['Has the potential impact on freedom of expression been assessed?'],
      },
      {
        code: 'HRM-11',
        title: 'Freedom of Movement',
        questions: ['Has the potential impact on freedom of movement been assessed?'],
      },
      {
        code: 'HRM-12',
        title: 'Freedom of Assembly',
        questions: ['Has the potential impact on freedom of assembly been assessed?'],
      },
      {
        code: 'HRM-13',
        title: 'Freedom of Association',
        questions: [
          'Has the potential impact on the right to freedom of association been assessed?',
        ],
      },
      {
        code: 'HRM-14',
        title: 'Right to Marriage and Family',
        questions: ['Has the potential impact on the right to marriage and family been assessed?'],
      },
      {
        code: 'HRM-15',
        title: 'Adequate Standard of Living',
        questions: [
          'Has the potential impact on the right to adequate standard of living (including health) been assessed?',
        ],
      },
      {
        code: 'HRM-16',
        title: 'Right to Education',
        questions: ['Has the potential impact on the right to education been assessed?'],
      },
      {
        code: 'HRM-17',
        title: 'Right to Social Security',
        questions: ['Has the potential impact on the right to social security been assessed?'],
      },
      {
        code: 'HRM-18',
        title: 'Cultural and Scientific Life',
        questions: [
          'Has the potential impact on the right to take part in cultural, artistic, scientific life been assessed?',
        ],
      },
      {
        code: 'HRM-19',
        title: 'Right to Work',
        questions: ['Has the potential impact on the right to work been assessed?'],
      },
      {
        code: 'HRM-20',
        title: 'Right to Leisure',
        questions: ['Has the potential impact on the right to leisure and rest been assessed?'],
      },
      {
        code: 'HRM-21',
        title: 'Minority Rights',
        questions: [
          'Has the potential impact on the rights of religious, ethnic, or linguistic minorities been assessed?',
        ],
      },
      {
        code: 'HRM-22',
        title: 'Rights of Children',
        questions: ['Has the potential impact on the rights of children been assessed?'],
      },
      {
        code: 'HRM-23',
        title: 'Freedom from Torture',
        questions: ['Has the potential impact on freedom from torture been assessed?'],
      },
      {
        code: 'HRM-24',
        title: 'Recognition Before the Law',
        questions: [
          'Has the potential impact on the right to recognition before the law been assessed?',
        ],
      },
      {
        code: 'HRM-25',
        title: 'Equality Before the Law',
        questions: [
          'Has the potential impact on the right to equality before the law been assessed?',
        ],
      },
      {
        code: 'HRM-26',
        title: 'Access to Justice',
        questions: ['Has the potential impact on access to justice been assessed?'],
      },
      {
        code: 'HRM-27',
        title: 'Freedom from Arbitrary Detention',
        questions: ['Has the potential impact on freedom from arbitrary detention been assessed?'],
      },
      {
        code: 'HRM-28',
        title: 'Right to a Fair Trial',
        questions: ['Has the potential impact on the right to a fair trial been assessed?'],
      },
      {
        code: 'HRM-29',
        title: 'Presumption of Innocence',
        questions: ['Has the potential impact on the presumption of innocence been assessed?'],
      },
      {
        code: 'HRM-30',
        title: 'Right to Legal Recourse',
        questions: ['Has the potential impact on the right to legal recourse been assessed?'],
      },
      {
        code: 'HRM-31',
        title: 'Right to Asylum',
        questions: ['Has the potential impact on the right to asylum been assessed?'],
      },
      {
        code: 'HRM-32',
        title: 'Right to Nationality',
        questions: ['Has the potential impact on the right to nationality been assessed?'],
      },
      {
        code: 'HRM-33',
        title: 'Public Affairs Participation',
        questions: [
          'Has the potential impact on the right to take part in public affairs been assessed?',
        ],
      },
      {
        code: 'HRM-34',
        title: 'Legal Instruments',
        questions: [
          'Have all applicable international/regional legal instruments for human rights protection in deployment jurisdictions been identified?',
        ],
      },
      {
        code: 'HRM-35',
        title: 'Oversight Bodies',
        questions: ['Have relevant human rights courts or oversight bodies been identified?'],
      },
      {
        code: 'HRM-36',
        title: 'Case Law',
        questions: [
          'Has the most relevant case law and legal provisions in the field of human rights been identified?',
        ],
      },
    ],
  },
  {
    id: 'undp-data-diligence',
    title: 'Due Diligence',
    article: 'Phase 3',
    items: [
      {
        code: 'DD-01',
        title: 'Data Origin',
        questions: [
          'Is the origin of primary training data documented (collected, purchased, scraped)? (CRITICAL)',
        ],
      },
      {
        code: 'DD-02',
        title: 'Data Consent',
        questions: ['Was consent obtained appropriately for data collection? (CRITICAL)'],
      },
      {
        code: 'DD-03',
        title: 'Data Diversity',
        questions: [
          'Have steps been taken to ensure data represents the diversity of the affected population (gender, race, age, disability, location)?',
        ],
      },
      {
        code: 'DD-04',
        title: 'Data Bias',
        questions: [
          'Have known limitations or potential biases in the dataset been identified and documented?',
        ],
      },
      {
        code: 'DD-05',
        title: 'Sensitive Data Protection',
        questions: [
          'Is personal/sensitive data handled and protected appropriately throughout the lifecycle?',
        ],
      },
      {
        code: 'DD-06',
        title: 'Data Labelling',
        questions: [
          'Are data labelling processes documented, including potential sources of subjective bias?',
        ],
      },
      {
        code: 'DD-07',
        title: 'Training Objective',
        questions: [
          'Is the specific goal/objective of the AI training documented (clarifies intended function vs. potential misuse)?',
        ],
      },
      {
        code: 'DD-08',
        title: 'Fairness Criteria',
        questions: [
          'Were fairness criteria/metrics used during training and evaluation (documented which ones)?',
        ],
      },
      {
        code: 'DD-09',
        title: 'Model Limitations',
        questions: [
          'Are known limitations, failure modes, and performance boundaries of the trained model documented?',
        ],
      },
      {
        code: 'DD-10',
        title: 'Model Type',
        questions: [
          'Is the type of AI model documented with rationale for selection (predictive, generative, etc.)?',
        ],
      },
      {
        code: 'DD-11',
        title: 'Performance Measurement',
        questions: ['Is system performance measured and documented? (CRITICAL)'],
      },
      {
        code: 'DD-12',
        title: 'Subgroup Performance',
        questions: [
          'Are performance results available broken down by relevant subgroups (age, gender, race, ethnicity, disability)? (CRITICAL)',
        ],
      },
      {
        code: 'DD-13',
        title: 'Model Documentation',
        questions: ['Is model documentation available (e.g., Model Card, Datasheet)?'],
      },
      {
        code: 'DD-14',
        title: 'Explainability',
        questions: [
          'Are features available for explaining specific AI decisions/outputs (explainability)? (CRITICAL)',
        ],
      },
      {
        code: 'DD-15',
        title: 'Human Oversight',
        questions: ['Is human oversight planned or required in the deployment context? (CRITICAL)'],
      },
      {
        code: 'DD-16',
        title: 'Post-Deployment Monitoring',
        questions: ['Does a process exist for post-deployment monitoring and updates? (CRITICAL)'],
      },
      {
        code: 'DD-17',
        title: 'Feedback and Complaints',
        questions: [
          'Does a process exist for addressing feedback, complaints, or identified problems? (CRITICAL)',
        ],
      },
      {
        code: 'DD-18',
        title: 'Input Testing',
        questions: [
          'Has input testing been performed (edge cases — informal language, unusual names, extreme values)?',
        ],
      },
      {
        code: 'DD-19',
        title: 'Bias Probing',
        questions: [
          'Has bias probing been performed (identical prompts with different demographic personas)?',
        ],
      },
      {
        code: 'DD-20',
        title: 'Functionality Testing',
        questions: [
          'Has functionality testing been performed (does the system reliably do what it claims)?',
        ],
      },
      {
        code: 'DD-21',
        title: 'Accessibility Check',
        questions: [
          'Has an accessibility check been performed (screen reader compatibility, alternative input methods)?',
        ],
      },
      {
        code: 'DD-22',
        title: 'Output Review',
        questions: [
          'Has an output review been performed (checked for hallucinations, factual errors, biased/harmful content)?',
        ],
      },
    ],
  },
  {
    id: 'undp-risk-analysis',
    title: 'Analysis',
    article: 'Phase 4',
    items: [
      {
        code: 'RA-01',
        title: 'Probability Assessment',
        questions: [
          'Has the probability of adverse outcomes been assessed for each affected right (Low / Medium / High / Very High)?',
        ],
      },
      {
        code: 'RA-02',
        title: 'Exposure Assessment',
        questions: [
          'Has exposure been assessed — the proportion of identified rights-holders potentially affected (Low / Medium / High / Very High)?',
        ],
      },
      {
        code: 'RA-03',
        title: 'Overall Likelihood',
        questions: [
          'Has overall likelihood been calculated using the Probability x Exposure matrix?',
        ],
      },
      {
        code: 'RA-04',
        title: 'Gravity of Prejudice',
        questions: [
          'Has gravity of prejudice been assessed — considering intensity, consequences, importance of the violated right, group-specific impact, and vulnerability (Low / Medium / High / Very High)?',
        ],
      },
      {
        code: 'RA-05',
        title: 'Effort to Overcome',
        questions: [
          'Has the effort to overcome adverse effects been assessed — reversibility and difficulty of remedy (Low / Medium / High / Very High)?',
        ],
      },
      {
        code: 'RA-06',
        title: 'Overall Severity',
        questions: ['Has overall severity been calculated using the Gravity x Effort matrix?'],
      },
      {
        code: 'RA-07',
        title: 'Risk Index',
        questions: [
          'Has the risk index been calculated for each affected right (Likelihood x Severity matrix)? (CRITICAL)',
        ],
      },
      {
        code: 'RA-08',
        title: 'Impact Visualisation',
        questions: [
          'Has a radial graph or equivalent visualisation been created showing impact across all affected rights?',
        ],
      },
      {
        code: 'RA-09',
        title: 'Independent Assessment',
        questions: [
          'Has each right been assessed independently — no cumulative index combining impacts across rights?',
        ],
      },
      {
        code: 'RA-10',
        title: 'Risk Exclusion Factors',
        questions: [
          'Have factors that may exclude risk been evaluated (legal limitations justifying certain impacts)?',
        ],
      },
      {
        code: 'RA-11',
        title: 'Balancing Test',
        questions: [
          'Has a balancing test been applied where conflicting rights exist (only after individual impact assessment)?',
        ],
      },
      {
        code: 'RA-12',
        title: 'Benefits Analysis',
        questions: [
          'Have potential benefits been analysed in terms of enhancing or safeguarding other protected rights?',
        ],
      },
    ],
  },
  {
    id: 'undp-risk-management',
    title: 'Management',
    article: 'Phase 5',
    items: [
      {
        code: 'RMG-01',
        title: 'Mitigation Measures',
        questions: [
          'Have specific measures been identified to prevent or mitigate each risk rated Medium, High, or Very High? (CRITICAL)',
        ],
      },
      {
        code: 'RMG-02',
        title: 'Contextualised Measures',
        questions: [
          'Are measures contextualised to the specific AI system, its characteristics, and deployment context?',
        ],
      },
      {
        code: 'RMG-03',
        title: 'Likelihood and Severity',
        questions: ['Do measures address both the likelihood and severity dimensions?'],
      },
      {
        code: 'RMG-04',
        title: 'Implementation Timeline',
        questions: ['Has an implementation timeline been established for each measure?'],
      },
      {
        code: 'RMG-05',
        title: 'Responsibility Assignment',
        questions: ['Has a responsible person/team been assigned for each measure?'],
      },
      {
        code: 'RMG-06',
        title: 'Residual Risk Re-Assessment',
        questions: [
          'After implementing mitigation measures, has residual risk been re-assessed for each affected right? (CRITICAL)',
        ],
      },
      {
        code: 'RMG-07',
        title: 'Residual Likelihood',
        questions: ['Has residual likelihood been re-calculated?'],
      },
      {
        code: 'RMG-08',
        title: 'Residual Severity',
        questions: ['Has residual severity been re-calculated?'],
      },
      {
        code: 'RMG-09',
        title: 'Residual Impact',
        questions: ['Has residual overall impact been documented?'],
      },
      {
        code: 'RMG-10',
        title: 'Acceptability Assessment',
        questions: ['Has the acceptability of residual risk been assessed?'],
      },
      {
        code: 'RMG-11',
        title: 'Persistent High Risk',
        questions: [
          'If residual risk remains High or Very High, have additional measures or project redesign been considered?',
        ],
      },
      {
        code: 'RMG-12',
        title: 'Decision Records',
        questions: [
          'Is a complete record maintained of all risk assessment decisions, scoring rationales, and matrix choices? (CRITICAL)',
        ],
      },
      {
        code: 'RMG-13',
        title: 'Scaling Criteria',
        questions: ['Is there a record of all scaling criteria used and justification for ranges?'],
      },
      {
        code: 'RMG-14',
        title: 'Stakeholder Input',
        questions: ['Is all stakeholder input documented?'],
      },
      {
        code: 'RMG-15',
        title: 'Effectiveness Documentation',
        questions: ['Are mitigation measures and their expected effectiveness documented?'],
      },
    ],
  },
  {
    id: 'undp-monitoring',
    title: 'Monitoring',
    article: 'Phase 6',
    items: [
      {
        code: 'MI-01',
        title: 'Monitoring Plan',
        questions: [
          'Has a monitoring plan been established for post-deployment performance of the AI system? (CRITICAL)',
        ],
      },
      {
        code: 'MI-02',
        title: 'Periodic Re-Assessment',
        questions: [
          'Has a schedule been set for periodic re-assessment (circular iterative approach)?',
        ],
      },
      {
        code: 'MI-03',
        title: 'Drift Detection',
        questions: ['Is a process in place to detect model drift and emerging biases over time?'],
      },
      {
        code: 'MI-04',
        title: 'Feedback Channels',
        questions: [
          'Have feedback channels been established for affected individuals to report harm? (CRITICAL)',
        ],
      },
      {
        code: 'MI-05',
        title: 'Remedy Mechanism',
        questions: [
          'Is an effective remedy/redress mechanism operational for individuals adversely affected? (CRITICAL)',
        ],
      },
      {
        code: 'MI-06',
        title: 'Re-Assessment Triggers',
        questions: [
          'Have triggers been defined for when a full re-assessment is required (e.g., significant system update, change in deployment context, new regulatory requirements, reported incidents)?',
        ],
      },
      {
        code: 'MI-07',
        title: 'Regulatory Incorporation',
        questions: [
          'Is there a process for incorporating new regulations and standards as they emerge?',
        ],
      },
      {
        code: 'MI-08',
        title: 'Feedback Loop',
        questions: [
          'Do the results of monitoring feed back into the risk assessment and mitigation cycle?',
        ],
      },
    ],
  },
  {
    id: 'undp-framework-alignment',
    title: 'Alignment',
    article: 'Phase 7',
    items: [
      {
        code: 'FA-01',
        title: 'State Duty to Protect',
        questions: [
          'UNGPs Pillar I — Is there awareness of state obligations in jurisdictions of deployment?',
        ],
      },
      {
        code: 'FA-02',
        title: 'Corporate Responsibility',
        questions: [
          'UNGPs Pillar II — Has the organisation conducted human rights due diligence across the AI lifecycle?',
        ],
      },
      {
        code: 'FA-03',
        title: 'Access to Remedy',
        questions: [
          'UNGPs Pillar III — Are effective grievance mechanisms in place for affected individuals?',
        ],
      },
      {
        code: 'FA-04',
        title: 'Inclusive Growth',
        questions: [
          'OECD — Does the AI system benefit society broadly and not exacerbate inequalities?',
        ],
      },
      {
        code: 'FA-05',
        title: 'Human-Centred Values',
        questions: [
          'OECD — Has an assessment of potential discrimination and inequitable outcomes been completed?',
        ],
      },
      {
        code: 'FA-06',
        title: 'Transparency and Explainability',
        questions: [
          'OECD — Is there documentation of how the AI works, its limitations, and how it makes decisions?',
        ],
      },
      {
        code: 'FA-07',
        title: 'Robustness and Safety',
        questions: [
          'OECD — Have failure modes, security vulnerabilities, and reliability been assessed?',
        ],
      },
      {
        code: 'FA-08',
        title: 'Accountability',
        questions: [
          'OECD — Have clear responsibilities and oversight mechanisms been established?',
        ],
      },
      {
        code: 'FA-09',
        title: 'EU AI Act Risk Classification',
        questions: [
          'Has the AI system risk classification been determined (Unacceptable / High / Limited / Minimal risk)? (CRITICAL)',
        ],
      },
      {
        code: 'FA-10',
        title: 'Fundamental Rights Impact Assessment',
        questions: [
          'If high-risk: Has a Fundamental Rights Impact Assessment (FRIA) been conducted as required under Article 27?',
        ],
      },
      {
        code: 'FA-11',
        title: 'Data Governance',
        questions: ['Are appropriate data governance measures in place?'],
      },
      {
        code: 'FA-12',
        title: 'Transparency Obligations',
        questions: [
          'Have transparency obligations been met (users informed they are interacting with AI where applicable)?',
        ],
      },
      {
        code: 'FA-13',
        title: 'Human Oversight Requirements',
        questions: ['Have human oversight requirements been established and documented?'],
      },
      {
        code: 'FA-14',
        title: 'Technical Documentation',
        questions: ['Is technical documentation maintained as required?'],
      },
      {
        code: 'FA-15',
        title: 'EU Database Registration',
        questions: ['Has registration in the EU database been completed (if applicable)?'],
      },
      {
        code: 'FA-16',
        title: 'Council of Europe Assessment',
        questions: [
          'Has the AI system been assessed for impact on human rights, democracy, and rule of law?',
        ],
      },
      {
        code: 'FA-17',
        title: 'Convention Compliance',
        questions: [
          "Does the system comply with the Council of Europe Convention's emphasis on human rights, democratic principles, and rule of law?",
        ],
      },
    ],
  },
];
