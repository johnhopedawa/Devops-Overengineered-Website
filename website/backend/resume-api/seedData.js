const { MongoClient } = require('mongodb');

const mongoURL = process.env.MONGO_URL || 'mongodb://mongodb-service:27017';
const client = new MongoClient(mongoURL);
const dbName = process.env.MONGO_DB_NAME || 'resumeDB';

const resumeData = {
  name: process.env.USER_NAME || "John Hope Dawa",
  title: "DevOps Engineer",
  email: process.env.USER_EMAIL || "johnhope.dawa@gmail.com",
  phone: process.env.USER_PHONE || "778-751-3049",
  location: process.env.USER_LOCATION || "Coquitlam, BC",
  download: {
    pdfUrl: "/api/resume/pdf",
    filename: "John Dawa Resume.pdf"
  },
  summary: "DevOps engineer with a background in operational coordination, process improvement, and systems management. Currently building Nyao Software Inc. as a personal company and home lab environment to design, break, automate, and document production-style infrastructure patterns. Experienced with Docker, Kubernetes, CI/CD, Terraform, observability, and cloud environments across GCP and AWS, with a practical focus on reliable deployments, troubleshooting, and clear technical communication.",
  skills: [
    "Docker",
    "Kubernetes",
    "Helm",
    "ArgoCD",
    "Terraform",
    "GitHub Actions",
    "Jenkins",
    "Traefik",
    "Python",
    "Bash",
    "Node.js",
    "Linux",
    "Git",
    "Prometheus",
    "Grafana",
    "MongoDB",
    "GCP",
    "AWS",
    "Yardi Voyager",
    "Rent Manager",
    "RentCafe",
    "Microsoft Office 365"
  ],
  experience: [
    {
      company: "Nyao Software Inc. / Personal Home Lab",
      role: "Founder & Home Lab DevOps Engineer",
      location: "Coquitlam, BC",
      duration: "Apr 2025 - Present",
      responsibilities: [
        "Built and operate a personal DevOps home lab under Nyao Software Inc. to practice production-style infrastructure design, automation, monitoring, and deployment workflows",
        "Run containerized services on Kubernetes using Helm and ArgoCD, using GitOps patterns to keep deployments reproducible and easy to inspect",
        "Build CI/CD pipelines with GitHub Actions to automate image builds, deployment changes, and validation steps for lab services",
        "Provision cloud and lab infrastructure with Terraform to keep environments consistent, documented, and repeatable",
        "Deploy Prometheus and Grafana monitoring stacks, building dashboards and alerts to understand service health and failure modes",
        "Manage Traefik ingress and TLS termination for multi-domain routing across the lab environment",
        "Use the site and supporting services as a hands-on sandbox for Docker, Kubernetes, observability, networking, secrets management, and release automation"
      ]
    },
    {
      company: "Parkbridge",
      role: "Assistant Property Manager",
      location: "Surrey, BC",
      duration: "Feb 2025 - Sep 2025",
      responsibilities: [
        "Coordinated large-scale operations across four communities (403 units), overseeing workflows, documentation, and issue resolution",
        "Managed digital systems for communication, scheduling, record-keeping, and compliance, ensuring accurate, organized data across teams",
        "Worked closely with technicians, vendors, and internal stakeholders to prioritize tasks, streamline processes, and maintain operational continuity",
        "Led process improvements that reduced bottlenecks and increased clarity in day-to-day operations",
        "Supported policy and compliance requirements by maintaining accurate documentation, structured procedures, and timely reporting"
      ]
    },
    {
      company: "Snoogz Software",
      role: "DevOps Engineer",
      location: "Vancouver, BC",
      duration: "Apr 2025 - Sep 2025",
      responsibilities: [
        "Build and operate production infrastructure for a microservices-based platform supporting multiple international deployments",
        "Serve as an on-call DevOps/SRE resource for high-severity production incidents, coordinating infrastructure and application-level remediation",
        "Containerize and maintain multiple services using Docker, managing image distribution to support consistent and repeatable deployments",
        "Deploy, operate, and maintain Kubernetes environments with a focus on reliability, scalability, and safe rollouts",
        "Design and maintain end-to-end Grafana dashboards and alerting to provide visibility across critical service flows",
        "Implement Prometheus metrics and distributed tracing for Java Spring Boot services following standardized observability specifications",
        "Create and maintain automated CI/CD pipelines using GitHub Actions and Jenkins to improve release reliability and developer velocity",
        "Manage infrastructure using Terraform to ensure consistent, reproducible environments across stages",
        "Collaborate with application teams to troubleshoot infrastructure, deployment, and observability issues, reducing operational overhead",
        "Automate remediation for common failure scenarios using Kubernetes operators and runbook-driven workflows",
        "Communicate complex technical and reliability concepts to leadership in clear, high-level terms to support decision-making"
      ]
    },
    {
      company: "Centurion Property Associates Inc.",
      role: "Resident Manager",
      location: "Surrey, BC",
      duration: "Mar 2023 - Feb 2025",
      responsibilities: [
        "Oversaw day-to-day building operations for 120 units, coordinating maintenance workflows, system checks, and communication between staff and management",
        "Implemented structured inspection routines and data tracking to improve consistency in reporting and operational standards",
        "Managed scheduling, task delegation, and performance follow-up for on-site and mobile staff",
        "Maintained accurate financial and administrative records, ensuring smooth operations and timely issue resolution",
        "Collaborated with leadership teams to analyze building performance and address operational priorities"
      ]
    },
    {
      company: "Hollyburn Properties Limited",
      role: "Resident Manager",
      location: "Vancouver, BC",
      duration: "Apr 2022 - Feb 2023",
      responsibilities: [
        "Managed operations across a large, multi-building portfolio (600+ units), coordinating maintenance teams and contractor workflows under tight timelines",
        "Oversaw project-scale work such as renovations and turnover scheduling, ensuring deadlines, documentation, and quality standards were met",
        "Maintained structured reporting, daily logs, and communication records to support operational transparency and compliance",
        "Supported data tracking, system organization, and workflow refinement across multiple properties",
        "Adapted communication and coordination strategies for varied teams and stakeholders, maintaining operational alignment across sites"
      ]
    },
    {
      company: "Hollyburn Properties Limited",
      role: "Relief Manager",
      location: "Vancouver, BC",
      duration: "Dec 2021 - Apr 2022",
      responsibilities: [
        "Provided weekend and vacation coverage across multiple high-occupancy buildings while maintaining continuity of operations and tenant support",
        "Responded to resident issues and service requests, coordinating emergency trades or resolving minor concerns directly",
        "Maintained detailed handover reports and records for weekday managers to ensure seamless communication and continuity"
      ]
    },
    {
      company: "Hollyburn Properties Limited",
      role: "Assistant Manager",
      location: "Vancouver, BC",
      duration: "Apr 2021 - Nov 2021",
      responsibilities: [
        "Supported daily building operations, tenant communications, lease administration, vendor access, and suite turnover preparation",
        "Assisted with inspections, service requests, office records, and early RTA-compliant property management processes",
        "Shadowed senior staff in rent processing, dispute documentation, and contractor coordination"
      ]
    }
  ],
  interests: ["Rock Climbing", "Outdoor Activities", "Running"]
};

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('resume');

    await collection.deleteMany({});
    await collection.insertOne(resumeData);
    console.log('Resume data inserted successfully!');

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
