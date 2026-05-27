import uuid
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.document import Document, DocumentDefinition
from app.models.framework import Framework
from app.models.project import Project
from app.models.reporting import ReportingEvidence
from app.services.sample_evidence_en import SAMPLE_EVIDENCE_EN
from app.services.sample_evidence_es import SAMPLE_EVIDENCE_ES, SAMPLE_PROJECT_ES

KNOWLEDGE_DIR = Path(__file__).resolve().parent.parent / "data" / "knowledge"

SEED_FRAMEWORKS = [
    {
        "name": "EU AI Act",
        "description": (
            "The European Union Artificial Intelligence Act establishes a comprehensive regulatory framework "
            "for AI systems based on risk classification. It mandates conformity assessments, transparency "
            "obligations, and human oversight requirements for high-risk AI systems."
        ),
        "category": "External",
        "status": "active",
        "documents": [
            {
                "name": "Technical Documentation",
                "description": (
                    "Must be compiled before market entry and retained for 10 years. "
                    "Must be immediately available to market surveillance authorities upon request."
                ),
                "article": "Annex IV",
            },
            {
                "name": "EU Declaration of Conformity",
                "description": (
                    "A signed written declaration that the system conforms to the Act. "
                    "Retained 10 years, translated into the language of the Member State."
                ),
                "article": "Art. 47, Annex V",
            },
            {
                "name": "CE Marking",
                "description": (
                    "Visible on the product or interface. For digital systems, "
                    "a digital CE marking accessible from the interface."
                ),
                "article": "Art. 48",
            },
            {
                "name": "EU Database Registration",
                "description": (
                    "System details must be registered in the centralized EU database for public traceability."
                ),
                "article": "Art. 71",
            },
            {
                "name": "Quality Management System Documentation",
                "description": (
                    "The 13-element QMS covering design, testing, risk management, incident response, etc. "
                    "Must be fully documented and available to authorities."
                ),
                "article": "Art. 17",
            },
            {
                "name": "Post-Market Surveillance Plan",
                "description": (
                    "Forms part of the technical documentation. Must document the monitoring system and indicators."
                ),
                "article": "Art. 72",
            },
            {
                "name": "Serious Incident Reports",
                "description": (
                    "Must be reported to the market surveillance authority within 2 days (systemic), "
                    "10 days (death), or 15 days (other serious incidents)."
                ),
                "article": "Art. 73",
            },
            {
                "name": "Automated Logs / Records",
                "description": "Must be retained at least 6 months and made available for regulatory review.",
                "article": "Art. 12",
            },
            {
                "name": "Fundamental Rights Impact Assessment",
                "description": (
                    "Required for public-sector deployers or private entities providing public services. "
                    "Results must be notified to the national market surveillance authority before deployment."
                ),
                "article": "Art. 27",
            },
            {
                "name": "Filter Assessment Documentation",
                "description": (
                    "For systems claiming the Article 6(3) exemption: why the system would normally be high-risk, "
                    "which filter condition applies, and proof it does not perform profiling."
                ),
                "article": "Art. 6(3)",
            },
        ],
    },
    {
        "name": "UNDP Human Rights Assessment",
        "description": (
            "The UNDP AI Human Rights Impact Assessment Toolkit provides a structured methodology for "
            "evaluating AI systems against international human rights standards. It guides organisations "
            "through stakeholder engagement, rights-based risk analysis, and ongoing monitoring to ensure "
            "AI deployments respect dignity, equality, and non-discrimination principles."
        ),
        "category": "External",
        "status": "active",
        "documents": [
            {
                "name": "Stakeholder Engagement Record",
                "description": (
                    "Documentation of consultations with affected communities, civil society organisations, "
                    "and rights holders, including methodology and findings."
                ),
                "article": "Section 2",
            },
            {
                "name": "Human Rights Impact Assessment Report",
                "description": (
                    "Comprehensive assessment documenting identified human rights risks, affected populations, "
                    "severity ratings, and mitigation measures for the AI system."
                ),
                "article": "Section 3",
            },
            {
                "name": "Algorithmic Impact Assessment",
                "description": (
                    "Technical evaluation of the AI system's decision-making processes, bias potential, "
                    "and differential impacts across demographic groups."
                ),
                "article": "Section 4",
            },
            {
                "name": "Data Protection Impact Assessment",
                "description": (
                    "Assessment of data collection, processing, and storage practices against privacy "
                    "rights and data protection principles."
                ),
                "article": "Section 5",
            },
            {
                "name": "Remedy and Redress Plan",
                "description": (
                    "Documented mechanisms for individuals to challenge AI-driven decisions, seek remedies, "
                    "and access effective redress when rights are violated."
                ),
                "article": "Section 6",
            },
            {
                "name": "Ongoing Monitoring Plan",
                "description": (
                    "Framework for continuous monitoring of human rights impacts post-deployment, "
                    "including indicators, review cycles, and escalation procedures."
                ),
                "article": "Section 7",
            },
        ],
    },
    {
        "name": "Environmental Impact Framework",
        "description": (
            "The Environmental Impact Framework for AI Systems provides a structured approach to measuring, "
            "reporting, and reducing the environmental footprint of AI development and deployment. It covers "
            "energy consumption, carbon emissions, hardware lifecycle, and data centre sustainability to "
            "promote responsible and environmentally conscious AI practices."
        ),
        "category": "Internal",
        "status": "active",
        "documents": [
            {
                "name": "Carbon Footprint Assessment",
                "description": (
                    "Quantitative assessment of greenhouse gas emissions from model training, inference, "
                    "and supporting infrastructure, measured in CO₂ equivalent."
                ),
                "article": "Principle 1",
            },
            {
                "name": "Energy Consumption Report",
                "description": (
                    "Detailed report of energy usage across training, inference, and idle phases, "
                    "including renewable energy percentage and power usage effectiveness (PUE)."
                ),
                "article": "Principle 2",
            },
            {
                "name": "Hardware Lifecycle Assessment",
                "description": (
                    "Assessment of environmental impact across the hardware lifecycle: manufacturing, "
                    "operation, and end-of-life disposal of GPUs, TPUs, and servers."
                ),
                "article": "Principle 3",
            },
            {
                "name": "Data Centre Sustainability Plan",
                "description": (
                    "Documentation of data centre environmental practices including cooling efficiency, "
                    "water usage, renewable energy sourcing, and waste management."
                ),
                "article": "Principle 4",
            },
            {
                "name": "Model Efficiency Report",
                "description": (
                    "Analysis of model architecture efficiency, including parameter count justification, "
                    "distillation opportunities, and inference optimisation strategies."
                ),
                "article": "Principle 5",
            },
            {
                "name": "Environmental Monitoring Plan",
                "description": (
                    "Ongoing monitoring framework for tracking environmental KPIs, setting reduction "
                    "targets, and reporting progress against sustainability goals."
                ),
                "article": "Principle 6",
            },
        ],
    },
]


OPTIONAL_FRAMEWORKS = {"Environmental Impact Framework"}


def _load_knowledge(framework_name: str) -> str:
    slug = framework_name.lower().replace(" ", "_")
    framework_dir = KNOWLEDGE_DIR / slug
    if not framework_dir.is_dir():
        return ""
    parts = [p.read_text() for p in sorted(framework_dir.glob("*.md"))]
    return "\n\n---\n\n".join(parts)


def seed_frameworks(db: Session) -> None:
    stale = db.query(Framework).filter(Framework.name == "Internal AI Guidelines").first()
    if stale:
        stale_defs = db.query(DocumentDefinition.id).filter(DocumentDefinition.framework_id == stale.id).all()
        stale_def_ids = [d.id for d in stale_defs]
        if stale_def_ids:
            db.query(Document).filter(Document.definition_id.in_(stale_def_ids)).delete()
            db.query(DocumentDefinition).filter(DocumentDefinition.id.in_(stale_def_ids)).delete()
        db.delete(stale)
        db.flush()

    for fw_data in SEED_FRAMEWORKS:
        if fw_data["name"] in OPTIONAL_FRAMEWORKS:
            continue

        existing = db.query(Framework).filter(Framework.name == fw_data["name"]).first()
        if existing:
            new_content = _load_knowledge(fw_data["name"])
            if new_content and existing.content != new_content:
                existing.content = new_content
            continue

        fw = Framework(
            name=fw_data["name"],
            description=fw_data["description"],
            category=fw_data["category"],
            status=fw_data["status"],
            content=_load_knowledge(fw_data["name"]),
        )
        db.add(fw)
        db.flush()

        for doc_data in fw_data["documents"]:
            db.add(
                DocumentDefinition(
                    framework_id=fw.id,
                    name=doc_data["name"],
                    description=doc_data["description"],
                    article=doc_data["article"],
                )
            )

    db.commit()


SAMPLE_PROJECT_EN = {
    "name": "Sample Project — Facial Recognition Access Control",
    "description": (
        "An AI-powered facial recognition system used for building access control "
        "in corporate office environments. The system captures facial images via "
        "security cameras at entry points, matches them against an enrolled employee "
        "database, and grants or denies physical access in real time. It operates "
        "autonomously without human intervention for each access decision."
    ),
    "risk_classification": "high",
    "intended_purpose": (
        "Automated identity verification and physical access control for corporate "
        "facilities. The system replaces traditional badge-based access with biometric "
        "authentication to improve security and reduce tailgating incidents."
    ),
    "intended_users": (
        "Corporate security teams (system administrators), facility managers "
        "(access policy configuration), and all employees (end users whose biometric "
        "data is processed for daily building access)."
    ),
    "deployment_context": (
        "Deployed across EU office buildings as the primary access control mechanism. "
        "Cameras are installed at all entry and exit points. The system processes "
        "biometric data of approximately 2,000 employees per site and operates 24/7."
    ),
    "questionnaire_answers": {
        "q1": "yes",
        "q2": "yes",
        "q3": ["none"],
        "q4": ["none"],
        "q5": "no",
        "q6": ["biometrics"],
        "q7": "yes",
        "q8": "no",
        "q9": ["none"],
        "q10": "no",
        "q11": "yes-bias",
        "q12": "on-the-loop",
        "q13": "no",
        "q14": "no",
        "q15": "no",
        "q16": "no",
        "q17": "no",
    },
}

SAMPLE_PROJECTS = [
    (SAMPLE_PROJECT_EN, SAMPLE_EVIDENCE_EN),
    (SAMPLE_PROJECT_ES, SAMPLE_EVIDENCE_ES),
]


def _seed_evidence(project_id: uuid.UUID, evidence: dict[str, str], db: Session) -> None:
    for item_key, comment in evidence.items():
        db.add(
            ReportingEvidence(
                project_id=project_id,
                item_key=item_key,
                comment=comment,
                covered=True,
            )
        )


def create_sample_project(user_id: uuid.UUID, db: Session) -> None:
    for project_data, evidence_data in SAMPLE_PROJECTS:
        project = Project(owner_id=user_id, **project_data)
        db.add(project)
        db.flush()
        _seed_evidence(project.id, evidence_data, db)
    db.commit()
