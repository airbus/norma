import type { ChecklistArea } from './reporting-checklist';

export const ENVIRONMENTAL_CHECKLIST: ChecklistArea[] = [
  {
    id: 'env-energy-carbon',
    title: 'Energy & Carbon',
    article: 'Principle 1–2',
    items: [
      {
        code: 'EC-01',
        title: 'Training Energy Measurement',
        questions: [
          'Has the total energy consumption for model training been measured and documented (in kWh)?',
          'Is the energy source mix (renewable vs. fossil) for training infrastructure known and recorded?',
        ],
      },
      {
        code: 'EC-02',
        title: 'Inference Energy Measurement',
        questions: [
          'Is ongoing energy consumption during inference monitored and reported?',
          'Are energy-per-query or energy-per-request metrics tracked for production workloads?',
        ],
      },
      {
        code: 'EC-03',
        title: 'Carbon Footprint Estimation',
        questions: [
          'Has the carbon footprint of the AI system been estimated using a recognised methodology (e.g., GHG Protocol, ML CO₂ Impact)?',
          'Are Scope 1, 2, and 3 emissions considered in the carbon assessment?',
        ],
      },
      {
        code: 'EC-04',
        title: 'Carbon Reduction Targets',
        questions: [
          'Are there documented targets for reducing the carbon footprint of the AI system over time?',
          'Is progress against carbon reduction targets reviewed at defined intervals?',
        ],
      },
      {
        code: 'EC-05',
        title: 'Renewable Energy Usage',
        questions: [
          'What percentage of energy consumed by the AI system comes from renewable sources?',
          'Are there commitments or plans to increase renewable energy usage for AI workloads?',
        ],
      },
      {
        code: 'EC-06',
        title: 'Carbon Offsetting',
        questions: [
          'If carbon offsetting is used, are the offsets verified and from credible programmes?',
        ],
      },
    ],
  },
  {
    id: 'env-hardware',
    title: 'Hardware',
    article: 'Principle 3',
    items: [
      {
        code: 'HW-01',
        title: 'Hardware Selection',
        questions: [
          'Has the environmental impact of hardware choices (GPU/TPU type, server specifications) been considered during procurement?',
          'Are energy-efficient hardware options prioritised where performance requirements allow?',
        ],
      },
      {
        code: 'HW-02',
        title: 'Hardware Utilisation',
        questions: [
          'Are hardware utilisation rates monitored to minimise idle resource consumption?',
          'Are workload scheduling strategies (e.g., batch processing, off-peak scheduling) used to improve efficiency?',
        ],
      },
      {
        code: 'HW-03',
        title: 'Hardware Lifespan',
        questions: [
          'Are hardware refresh cycles planned to balance performance needs with environmental impact?',
          'Is hardware reuse, refurbishment, or donation considered before disposal?',
        ],
      },
      {
        code: 'HW-04',
        title: 'E-Waste Management',
        questions: [
          'Is end-of-life hardware disposed of through certified e-waste recycling programmes?',
          'Are hazardous materials in hardware components tracked and managed according to regulations?',
        ],
      },
      {
        code: 'HW-05',
        title: 'Supply Chain Sustainability',
        questions: [
          'Are hardware suppliers assessed for their environmental practices and sustainability commitments?',
        ],
      },
    ],
  },
  {
    id: 'env-data-management',
    title: 'Data Mgmt',
    article: 'Principle 4',
    items: [
      {
        code: 'DM-01',
        title: 'Data Storage Efficiency',
        questions: [
          'Are data storage practices optimised to minimise energy consumption (e.g., tiered storage, compression, deduplication)?',
          'Is there a data retention policy that ensures unnecessary data is deleted to reduce storage footprint?',
        ],
      },
      {
        code: 'DM-02',
        title: 'Data Transfer Efficiency',
        questions: [
          'Are data transfer volumes minimised through edge processing, caching, or data locality strategies?',
          'Is the environmental cost of large-scale data transfers (e.g., cross-region, cross-cloud) considered?',
        ],
      },
      {
        code: 'DM-03',
        title: 'Data Centre Selection',
        questions: [
          'Are data centres selected based on environmental criteria such as PUE, water usage effectiveness, and renewable energy sourcing?',
          'Is the geographical location of data centres chosen to optimise for cooler climates or renewable energy availability?',
        ],
      },
      {
        code: 'DM-04',
        title: 'Water Usage',
        questions: [
          'Is the water usage of cooling systems for AI workloads measured and documented?',
          'Are water-efficient cooling technologies employed where feasible?',
        ],
      },
    ],
  },
  {
    id: 'env-model-efficiency',
    title: 'Efficiency',
    article: 'Principle 5',
    items: [
      {
        code: 'ME-01',
        title: 'Model Size Justification',
        questions: [
          'Is the model size (parameter count) justified relative to the task requirements?',
          'Have smaller or more efficient model architectures been evaluated before selecting the final model?',
        ],
      },
      {
        code: 'ME-02',
        title: 'Training Efficiency',
        questions: [
          'Are efficient training techniques used (e.g., transfer learning, mixed-precision training, early stopping)?',
          'Is the number of training runs and hyperparameter searches documented and justified?',
        ],
      },
      {
        code: 'ME-03',
        title: 'Inference Optimisation',
        questions: [
          'Are inference optimisation techniques applied (e.g., quantisation, pruning, distillation, caching)?',
          'Is the trade-off between model accuracy and computational cost explicitly evaluated?',
        ],
      },
      {
        code: 'ME-04',
        title: 'Retraining Frequency',
        questions: [
          'Is the retraining schedule justified based on performance degradation metrics rather than fixed intervals?',
          'Are incremental or fine-tuning approaches used instead of full retraining where possible?',
        ],
      },
      {
        code: 'ME-05',
        title: 'Benchmarking',
        questions: [
          'Are environmental efficiency metrics (e.g., accuracy-per-watt, throughput-per-kWh) tracked alongside performance metrics?',
        ],
      },
    ],
  },
  {
    id: 'env-lifecycle',
    title: 'Lifecycle',
    article: 'Principle 3, 6',
    items: [
      {
        code: 'LC-01',
        title: 'Lifecycle Assessment',
        questions: [
          'Has a lifecycle assessment been conducted covering the environmental impact from development through deployment to decommissioning?',
          'Are embodied emissions from hardware manufacturing included in the lifecycle assessment?',
        ],
      },
      {
        code: 'LC-02',
        title: 'Decommissioning Plan',
        questions: [
          'Is there a documented plan for environmentally responsible decommissioning of the AI system and its infrastructure?',
          'Does the decommissioning plan address data deletion, hardware disposal, and service wind-down?',
        ],
      },
      {
        code: 'LC-03',
        title: 'Vendor and Cloud Sustainability',
        questions: [
          'Are cloud providers and third-party vendors assessed for their environmental commitments and reporting?',
          'Do service-level agreements include environmental performance criteria?',
        ],
      },
      {
        code: 'LC-04',
        title: 'Circular Economy Practices',
        questions: [
          'Are circular economy principles (reuse, repair, recycle) applied to AI infrastructure and hardware?',
        ],
      },
    ],
  },
  {
    id: 'env-monitoring',
    title: 'Monitoring',
    article: 'Principle 6',
    items: [
      {
        code: 'EM-01',
        title: 'Environmental KPIs',
        questions: [
          'Are environmental key performance indicators (KPIs) defined for the AI system (e.g., energy per inference, total carbon, water usage)?',
          'Are KPIs reviewed and updated at regular intervals?',
        ],
      },
      {
        code: 'EM-02',
        title: 'Reporting and Disclosure',
        questions: [
          'Is environmental impact data reported to internal stakeholders and, where applicable, to external bodies?',
          'Does environmental reporting follow a recognised standard or framework (e.g., GRI, CDP, TCFD)?',
        ],
      },
      {
        code: 'EM-03',
        title: 'Continuous Improvement',
        questions: [
          'Is there a documented process for identifying and implementing environmental improvements based on monitoring data?',
          'Are lessons learned from environmental incidents or performance shortfalls systematically captured?',
        ],
      },
      {
        code: 'EM-04',
        title: 'Regulatory Compliance',
        questions: [
          'Does the organisation track and comply with applicable environmental regulations related to AI and data centre operations?',
        ],
      },
      {
        code: 'EM-05',
        title: 'Sustainability Targets Integration',
        questions: [
          'Are AI-specific environmental targets aligned with the organisation’s broader sustainability goals and commitments (e.g., net-zero pledges)?',
        ],
      },
    ],
  },
];
