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
  summary: "DevOps Engineer with a strong background in operational coordination, process improvement, and systems management. I focus on building production infrastructure, automating deployment workflows, and maintaining reliable environments for microservices-based platforms. I work with Docker, Kubernetes, CI/CD, Terraform, and cloud tooling. Outside of work, I'm building a fully containerized website in my spare time to see how far I can push modern infrastructure patterns.",
  skills: [
    "Docker",
    "Kubernetes",
    "Terraform",
    "GitHub Actions",
    "Jenkins",
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
    "Yardi Voyager",
    "Rent Manager",
    "RentCafe",
    "Microsoft Office 365"
  ],
  experience: [
    {
      company: "Snoogz Software",
      role: "DevOps Engineer",
      location: "Vancouver, BC",
      duration: "September 2025 – Present",
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
      company: "Parkbridge Lifestyle Communities Inc.",
      role: "Assistant Property Manager",
      location: "Coquitlam, BC",
      duration: "February 2025 – September 2025",
      responsibilities: [
        "Coordinated large-scale operations across four communities (403 units), overseeing workflows, documentation, and issue resolution",
        "Managed digital systems for communication, scheduling, record-keeping, and compliance, ensuring accurate, organized data across teams",
        "Worked closely with technicians, vendors, and internal stakeholders to prioritize tasks, streamline processes, and maintain operational continuity",
        "Led process improvements that reduced bottlenecks and increased clarity in day-to-day operations",
        "Supported policy and compliance requirements by maintaining accurate documentation, structured procedures, and timely reporting"
      ]
    },
    {
      company: "Centurion Properties Associates",
      role: "Resident Manager",
      location: "Coquitlam, BC",
      duration: "March 2023 – February 2025",
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
      duration: "April 2021 – February 2023",
      responsibilities: [
        "Managed operations across a large, multi-building portfolio (600+ units), coordinating maintenance teams and contractor workflows under tight timelines",
        "Oversaw project-scale work such as renovations and turnover scheduling, ensuring deadlines, documentation, and quality standards were met",
        "Maintained structured reporting, daily logs, and communication records to support operational transparency and compliance",
        "Supported data tracking, system organization, and workflow refinement across multiple properties",
        "Adapted communication and coordination strategies for varied teams and stakeholders, maintaining operational alignment across sites"
      ]
    }
  ],
  interests: ["Rock Climbing", "Outdoor Activities", "Running", "Memes"]
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