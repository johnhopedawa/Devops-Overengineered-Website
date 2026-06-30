const { MongoClient } = require('mongodb');

const mongoURL = process.env.MONGO_URL || 'mongodb://mongodb-service:27017';
const client = new MongoClient(mongoURL);
const dbName = process.env.MONGO_DB_NAME || 'resumeDB';

const resumeData = {
  name: process.env.USER_NAME || "John Hope Dawa",
  title: "DevOps Engineer",
  email: process.env.USER_EMAIL || "johnhope.dawa@gmail.com",
  phone: "778-751-3049",
  location: process.env.USER_LOCATION || "Coquitlam, BC",
  summary: "DevOps Engineer with a background in operational coordination, process improvement, and systems management, now focused on building and maintaining production infrastructure for SaaS and custom business software platforms. Experienced with Docker, Kubernetes, CI/CD, Terraform, observability, and cloud environments across GCP and AWS. Strong ability to automate deployment workflows, improve reliability, troubleshoot infrastructure issues, and communicate technical concepts clearly across engineering and leadership teams.",
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
      company: "Nyao Software Inc.",
      role: "DevOps Engineer",
      location: "Vancouver, BC",
      duration: "April 2025 – Present",
      responsibilities: [
        "Design and operate cloud infrastructure for a SaaS platform across GCP and AWS, ensuring high availability and cost efficiency",
        "Manage containerized microservices deployments on Kubernetes using Helm and ArgoCD, implementing GitOps workflows for fully automated rollouts",
        "Build and maintain CI/CD pipelines with GitHub Actions, enabling zero-touch deployments from code commit to production",
        "Provision and manage cloud infrastructure using Terraform, maintaining consistent and reproducible environments across all stages",
        "Deploy and operate Prometheus and Grafana monitoring stacks, building dashboards and alerts to provide full observability across services",
        "Manage Traefik ingress and TLS termination for multi-domain traffic routing across the platform",
        "Architect and maintain multi-architecture Docker image builds and registry workflows to support cross-platform deployments"
      ]
    },
    {
      company: "Snoogz Software",
      role: "DevOps Engineer",
      location: "Vancouver, BC",
      duration: "August 2024 – March 2025",
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
      company: "QuadReal Property Group",
      role: "Assistant Property Manager",
      location: "Surrey, BC",
      duration: "January 2024 – August 2024",
      responsibilities: [
        "Coordinated large-scale operations across four communities (403 units), overseeing workflows, documentation, and issue resolution",
        "Managed digital systems for communication, scheduling, record-keeping, and compliance, ensuring accurate, organized data across teams",
        "Worked closely with technicians, vendors, and internal stakeholders to prioritize tasks, streamline processes, and maintain operational continuity",
        "Led process improvements that reduced bottlenecks and increased clarity in day-to-day operations",
        "Supported policy and compliance requirements by maintaining accurate documentation, structured procedures, and timely reporting"
      ]
    },
    {
      company: "Centurion Property Associates Inc.",
      role: "Resident Manager",
      location: "Surrey, BC",
      duration: "January 2023 – December 2023",
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
      role: "Resident Manager / Relief Manager / Assistant Manager",
      location: "Vancouver, BC",
      duration: "April 2021 – January 2023",
      responsibilities: [
        "Managed operations across a large, multi-building portfolio (600+ units), coordinating maintenance teams and contractor workflows under tight timelines",
        "Oversaw project-scale work such as renovations and turnover scheduling, ensuring deadlines, documentation, and quality standards were met",
        "Maintained structured reporting, daily logs, and communication records to support operational transparency and compliance",
        "Supported data tracking, system organization, and workflow refinement across multiple properties",
        "Adapted communication and coordination strategies for varied teams and stakeholders, maintaining operational alignment across sites"
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

    // Clear existing data
    await collection.deleteMany({});

    // Insert new data
    await collection.insertOne(resumeData);
    console.log('Resume data inserted successfully!');

    // Close connection and exit so server.js can start
    await client.close();
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();