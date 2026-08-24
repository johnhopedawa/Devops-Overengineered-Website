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
  summary: "Aspiring DevOps Engineer with a background in operational coordination, process improvement, and technical infrastructure. Currently developing hands-on experience through Nyao Software Inc. and a personal HomeLab, including a 3-node bare-metal K3s cluster, GitOps deployments, CI/CD pipelines, Terraform-managed cloud services, monitoring, and web applications. Hands-on experience using Linux, Docker, Kubernetes/K3s, Terraform, CI/CD, GitHub Actions, AWS, GCP, observability tools, and networking fundamentals including DNS, TLS, ports, ingress, and connectivity troubleshooting.",
  skills: [
    "Docker",
    "Kubernetes",
    "K3s",
    "Helm",
    "ArgoCD",
    "Terraform",
    "GitHub Actions",
    "Docker Buildx",
    "Jenkins",
    "Traefik",
    "NGINX",
    "Python",
    "Bash",
    "Node.js",
    "Linux",
    "Git",
    "Prometheus",
    "Grafana",
    "MongoDB",
    "GCP",
    "GCP Cloud Run",
    "AWS",
    "Yardi Voyager",
    "Rent Manager",
    "RentCafe",
    "Microsoft Office 365"
  ],
  experience: [
    {
      company: "Nyao Software Inc. [HomeLab]",
      role: "Founder & HomeLab DevOps Engineer",
      location: "Coquitlam, BC",
      duration: "April 2025 - Present",
      responsibilities: [
        "Built and operate a 3-node bare-metal Linux K3s HomeLab running on two MQ910 mini PCs and one Raspberry Pi, with one control-plane node and two worker nodes",
        "Run johnhopedawa.com as a containerized platform with NGINX frontend, Node.js API gateway, resume API, metrics API, MongoDB, Traefik ingress, and persistent storage",
        "Manage the application stack with Helm and ArgoCD, using Git as the source of truth for Kubernetes deployments, services, ingress, configuration, and image tags",
        "Build multi-architecture Docker images for amd64 and arm64 with GitHub Actions, Docker Buildx, and Docker Hub so the same services run across mini PCs and Raspberry Pi hardware",
        "Operate Prometheus, Grafana, kube-state-metrics, and Node Exporter to monitor node CPU, memory, pod health, service status, and cluster behavior",
        "Provision and update GCP Cloud Run services with Terraform, connecting serverless health-check workloads to the bare-metal Kubernetes lab for hybrid-cloud practice",
        "Manage one daycare website for a client, including the public-facing site, internal admin tool, content updates, admin workflows, data entry, operational usability, and deployment concerns",
        "Use the environment as a hands-on sandbox for Kubernetes troubleshooting, GitOps drift, observability, networking, secrets handling, release automation, and runbook-style operations"
      ]
    },
    {
      company: "Parkbridge Lifestyle Communities Inc",
      role: "Assistant Property Manager",
      location: "Surrey, BC",
      duration: "February 2025 - September 2025",
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
      duration: "April 2025 - September 2025",
      responsibilities: [
        "Build and operate production infrastructure for a microservices-based platform supporting multiple international deployments",
        "Serve as an on-call DevOps/SRE resource for high-severity production incidents, coordinating infrastructure and application-level remediation",
        "Containerize and maintain multiple services using Docker, managing image distribution to support consistent and repeatable deployments",
        "Deploy, operate, and maintain Kubernetes environments with a focus on reliability, scalability, and safe rollouts",
        "Design and maintain end-to-end Grafana dashboards and alerting to provide visibility across critical service flows",
        "Implement Prometheus metrics and distributed tracing for Java Spring Boot services following standardized observability specifications",
        "Create and maintain automated CI/CD pipelines using GitHub Actions and Jenkins to improve release reliability and developer velocity",
        "Manage infrastructure using Terraform to ensure consistent, reproducible environments across stages",
        "Troubleshoot infrastructure, deployment, observability, configuration, and rollout issues across containerized services",
        "Automate remediation for common failure scenarios using Kubernetes operators and runbook-driven workflows",
        "Communicate complex technical and reliability concepts to leadership in clear, high-level terms to support decision-making"
      ]
    },
    {
      company: "Centurion Properties Associates",
      role: "Resident Manager",
      location: "Surrey, BC",
      duration: "March 2023 - February 2025",
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
      duration: "April 2022 - February 2023",
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
      duration: "December 2021 - April 2022",
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
      duration: "April 2021 - November 2021",
      responsibilities: [
        "Supported daily building operations, tenant communications, lease administration, vendor access, and suite turnover preparation",
        "Assisted with inspections, service requests, office records, and early RTA-compliant property management processes",
        "Shadowed senior staff in rent processing, dispute documentation, and contractor coordination"
      ]
    }
  ],
  projects: [
    {
      name: "johnhopedawa.com HomeLab Platform",
      stack: "K3s, Helm, ArgoCD, Traefik, NGINX, Node.js, MongoDB, Prometheus, Grafana",
      details: [
        "Runs on a 3-node bare-metal K3s cluster made from two MQ910 mini PCs and one Raspberry Pi",
        "Deploys a multi-service website stack including frontend, API gateway, resume API, metrics API, MongoDB, ingress, PVCs, and config through Helm",
        "Uses Prometheus and Grafana for live node, pod, memory, CPU, and service-health visibility"
      ]
    },
    {
      name: "Managed Daycare Website and Admin Tool",
      stack: "Public website, admin workflows, content updates, deployment support",
      details: [
        "Manage one daycare site for a client, including the public-facing website and a private admin-use tool for daycare operations",
        "Focused on practical admin workflows, content/data management, and a usable front-facing experience",
        "Handled deployment-oriented concerns so the site could be maintained outside local development"
      ]
    },
    {
      name: "Hybrid Cloud Health and Metrics APIs",
      stack: "Node.js, GCP Cloud Run, Terraform, Prometheus, GitHub Actions",
      details: [
        "Built a Cloud Run health-check API deployed with Terraform and container automation",
        "Built a metrics API that queries Prometheus inside the cluster and exposes clean JSON for the website dashboard",
        "Practiced CI/CD flows from git push to Docker image publishing, infrastructure updates, and service rollout"
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
