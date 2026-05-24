from sqlalchemy.orm import Session

from app.models.document import DocumentDefinition
from app.models.framework import Framework

SEED_FRAMEWORKS = [
    {
        "name": "EU AI Act",
        "description": (
            "The European Union Artificial Intelligence Act establishes a comprehensive regulatory framework "
            "for AI systems based on risk classification. It mandates conformity assessments, transparency "
            "obligations, and human oversight requirements for high-risk AI systems."
        ),
        "category": "Regulation",
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
        "name": "Internal AI Guidelines",
        "description": (
            "Company-specific guidelines for responsible AI development and deployment. "
            "Covers model governance, ethical review processes, bias testing protocols, "
            "and operational monitoring requirements aligned with corporate values and industry best practices."
        ),
        "category": "Internal",
        "status": "draft",
        "documents": [
            {
                "name": "Internal Governance Policy",
                "description": (
                    "Company-specific policy defining AI governance structure, roles, "
                    "responsibilities, and escalation procedures."
                ),
                "article": "",
            },
            {
                "name": "Ethics Review Report",
                "description": (
                    "Documented ethical review of the AI system covering fairness, accountability, and societal impact."
                ),
                "article": "",
            },
            {
                "name": "Bias Testing Report",
                "description": (
                    "Results of bias detection and mitigation testing across "
                    "protected attributes and demographic groups."
                ),
                "article": "",
            },
        ],
    },
]


def seed_frameworks(db: Session) -> None:
    for fw_data in SEED_FRAMEWORKS:
        existing = db.query(Framework).filter(Framework.name == fw_data["name"]).first()
        if existing:
            continue

        fw = Framework(
            name=fw_data["name"],
            description=fw_data["description"],
            category=fw_data["category"],
            status=fw_data["status"],
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
