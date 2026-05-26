export interface Project {
  id: string;
  name: string;
  description: string;
  riskClassification: 'unacceptable' | 'high' | 'limited' | 'minimal';
  intendedPurpose: string;
  intendedUsers: string;
  deploymentContext: string;
}

export interface MandatoryDocument {
  id: string;
  name: string;
  description: string;
  article: string;
  framework: string;
  uploaded: boolean;
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  category: string;
  documentCount: number;
  status: 'active' | 'draft' | 'inactive';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Sample Project',
    description: 'AI-powered predictive maintenance system for industrial equipment monitoring.',
    riskClassification: 'high',
    intendedPurpose:
      'Predict component failures before they occur using sensor data and machine learning models, reducing unplanned downtime and maintenance costs.',
    intendedUsers:
      'Maintenance engineers, operations managers, and automated monitoring systems. Affected persons include field technicians who act on system recommendations.',
    deploymentContext:
      'Deployed on-premise within industrial facilities across EU member states. Integrates with existing MRO workflows and CMMS platforms.',
  },
];

export const MANDATORY_DOCUMENTS: MandatoryDocument[] = [
  {
    id: '1',
    name: 'Technical Documentation',
    description:
      'Must be compiled before market entry and retained for 10 years. Must be immediately available to market surveillance authorities upon request.',
    article: 'Annex IV',
    framework: 'EU AI Act',
    uploaded: true,
  },
  {
    id: '2',
    name: 'EU Declaration of Conformity',
    description:
      'A signed written declaration that the system conforms to the Act. Retained 10 years, translated into the language of the Member State.',
    article: 'Art. 47, Annex V',
    framework: 'EU AI Act',
    uploaded: false,
  },
  {
    id: '3',
    name: 'CE Marking',
    description:
      'Visible on the product or interface. For digital systems, a digital CE marking accessible from the interface.',
    article: 'Art. 48',
    framework: 'EU AI Act',
    uploaded: false,
  },
  {
    id: '4',
    name: 'EU Database Registration',
    description:
      'System details must be registered in the centralized EU database for public traceability.',
    article: 'Art. 71',
    framework: 'EU AI Act',
    uploaded: false,
  },
  {
    id: '5',
    name: 'Quality Management System Documentation',
    description:
      'The 13-element QMS covering design, testing, risk management, incident response, etc. Must be fully documented and available to authorities.',
    article: 'Art. 17',
    framework: 'EU AI Act',
    uploaded: true,
  },
  {
    id: '6',
    name: 'Post-Market Surveillance Plan',
    description:
      'Forms part of the technical documentation. Must document the monitoring system and indicators.',
    article: 'Art. 72',
    framework: 'EU AI Act',
    uploaded: false,
  },
  {
    id: '7',
    name: 'Serious Incident Reports',
    description:
      'Must be reported to the market surveillance authority within 2 days (systemic), 10 days (death), or 15 days (other serious incidents).',
    article: 'Art. 73',
    framework: 'EU AI Act',
    uploaded: false,
  },
  {
    id: '8',
    name: 'Automated Logs / Records',
    description: 'Must be retained at least 6 months and made available for regulatory review.',
    article: 'Art. 12',
    framework: 'EU AI Act',
    uploaded: true,
  },
  {
    id: '9',
    name: 'Fundamental Rights Impact Assessment',
    description:
      'Required for public-sector deployers or private entities providing public services. Results must be notified to the national market surveillance authority before deployment.',
    article: 'Art. 27',
    framework: 'EU AI Act',
    uploaded: false,
  },
  {
    id: '10',
    name: 'Filter Assessment Documentation',
    description:
      'For systems claiming the Article 6(3) exemption: why the system would normally be high-risk, which filter condition applies, and proof it does not perform profiling.',
    article: 'Art. 6(3)',
    framework: 'EU AI Act',
    uploaded: false,
  },
  {
    id: '11',
    name: 'Internal Governance Policy',
    description:
      'Company-specific policy defining AI governance structure, roles, responsibilities, and escalation procedures.',
    article: '',
    framework: 'Internal AI Guidelines',
    uploaded: true,
  },
  {
    id: '12',
    name: 'Ethics Review Report',
    description:
      'Documented ethical review of the AI system covering fairness, accountability, and societal impact.',
    article: '',
    framework: 'Internal AI Guidelines',
    uploaded: false,
  },
  {
    id: '13',
    name: 'Bias Testing Report',
    description:
      'Results of bias detection and mitigation testing across protected attributes and demographic groups.',
    article: '',
    framework: 'Internal AI Guidelines',
    uploaded: false,
  },
];

export const MOCK_FRAMEWORKS: Framework[] = [
  {
    id: '1',
    name: 'EU AI Act',
    description:
      'The European Union Artificial Intelligence Act establishes a comprehensive regulatory framework for AI systems based on risk classification. It mandates conformity assessments, transparency obligations, and human oversight requirements for high-risk AI systems.',
    category: 'Regulation',
    documentCount: 3,
    status: 'active',
  },
  {
    id: '3',
    name: 'Internal AI Guidelines',
    description:
      'Company-specific guidelines for responsible AI development and deployment. Covers model governance, ethical review processes, bias testing protocols, and operational monitoring requirements aligned with corporate values and industry best practices.',
    category: 'Internal',
    documentCount: 1,
    status: 'draft',
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [];

export const SUGGESTED_QUESTIONS = [
  'What risk level is our project under the EU AI Act?',
  'Summarise our compliance gaps',
  'What documents are we missing for conformity assessment?',
  'Explain Article 14 human oversight requirements',
];
