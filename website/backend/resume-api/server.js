const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const PORT = 3001;

// MongoDB connection
const mongoURL = process.env.MONGO_URL || 'mongodb://mongodb-service:27017';
const client = new MongoClient(mongoURL);
const dbName = process.env.MONGO_DB_NAME || 'resumeDB';

// Connect to MongoDB
client.connect()
  .then(async () => {
    console.log('Resume API: Connected to MongoDB!');

    const db = client.db(dbName);
    const count = await db.collection('resume').countDocuments();

    if (count === 0) {
      console.log('Resume API: Database empty, data should be seeded via seedData.js');
    } else {
      console.log(`Resume API: Found ${count} resume document(s) in database`);
    }
  })
  .catch(err => {
    console.error('Resume API: MongoDB connection error:', err);
  });

// Middleware to parse JSON
app.use(express.json());

const PDF_FILENAME = 'John Dawa Resume.pdf';

function escapePdfText(value) {
  return String(value ?? '')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '-')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function estimateTextWidth(text, fontSize) {
  return String(text ?? '').length * fontSize * 0.46;
}

function wrapText(text, maxWidth, fontSize) {
  const words = String(text ?? '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (estimateTextWidth(next, fontSize) <= maxWidth || !line) {
      line = next;
      return;
    }

    lines.push(line);
    line = word;
  });

  if (line) lines.push(line);
  return lines;
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function createPdfDocument(pages) {
  const objects = [];

  function addObject(body) {
    objects.push(body);
    return objects.length;
  }

  const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const pageIds = [];

  pages.forEach((page) => {
    const content = page.join('\n');
    const contentId = addObject(`<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream`);
    const pageId = addObject(`<< /Type /Page /Parent 0 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  });

  const pagesId = addObject(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`);
  pageIds.forEach((pageId) => {
    objects[pageId - 1] = objects[pageId - 1].replace('/Parent 0 0 R', `/Parent ${pagesId} 0 R`);
  });
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  const chunks = ['%PDF-1.4\n'];
  const offsets = [0];

  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(chunks.join(''), 'utf8'));
    chunks.push(`${index + 1} 0 obj\n${body}\nendobj\n`);
  });

  const xrefOffset = Buffer.byteLength(chunks.join(''), 'utf8');
  chunks.push(`xref\n0 ${objects.length + 1}\n`);
  chunks.push('0000000000 65535 f \n');
  offsets.slice(1).forEach((offset) => {
    chunks.push(`${String(offset).padStart(10, '0')} 00000 n \n`);
  });
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return Buffer.from(chunks.join(''), 'utf8');
}

function findExperience(experience, company, role) {
  return (experience || []).find((job) => (
    job.company === company && (!role || job.role === role)
  ));
}

function findExperienceByCompanyPrefix(experience, companyPrefix, role) {
  return (experience || []).find((job) => (
    job.company?.startsWith(companyPrefix) && (!role || job.role === role)
  ));
}

function getPdfExperience(resumeData) {
  const experience = resumeData.experience || [];
  const nyao = findExperienceByCompanyPrefix(experience, 'Nyao Software Inc.');
  const parkbridge = findExperience(experience, 'Parkbridge Lifestyle Communities Inc') || findExperience(experience, 'Parkbridge');
  const snoogz = findExperience(experience, 'Snoogz Software');
  const centurion = findExperience(experience, 'Centurion Properties Associates') || findExperience(experience, 'Centurion Property Associates Inc.');
  const hollyburnRoles = experience.filter((job) => job.company === 'Hollyburn Properties Limited');

  return [
    {
      role: nyao?.role || 'Founder & HomeLab DevOps Engineer',
      company: nyao?.company || 'Nyao Software Inc. [HomeLab]',
      duration: nyao?.duration || 'April 2025 - Present',
      bullets: [
        'Built and operate a 3-node bare-metal K3s HomeLab on two MQ910 mini PCs and one Raspberry Pi, hosting johnhopedawa.com with NGINX, API gateway, resume API, metrics API, MongoDB, Traefik, and persistent storage.',
        'Use Helm and ArgoCD for GitOps delivery, with Kubernetes deployments, services, ingress, config, PVCs, and image tags managed from Git.',
        'Build multi-arch Docker images with GitHub Actions and Docker Buildx; use Terraform for GCP Cloud Run services and hybrid-cloud infrastructure practice.',
        'Operate Prometheus, Grafana, kube-state-metrics, and Node Exporter for live visibility into node CPU, memory, pod health, service status, and cluster behavior.',
        'Manage one daycare website for a client, including the public site, internal admin tool, content updates, admin workflows, data entry, usability, and deployment concerns.'
      ]
    },
    {
      role: parkbridge?.role || 'Assistant Property Manager',
      company: parkbridge?.company || 'Parkbridge Lifestyle Communities Inc',
      duration: parkbridge?.duration || 'February 2025 - September 2025',
      bullets: [
        'Oversaw operations and tenant relations for four manufactured-home communities totaling 403 households across BC.',
        'Managed leasing, resident communications, rent roll posting, A/R and A/P reconciliation, annual rent-increase notices, maintenance coordination, and RTA/MHPTA documentation.'
      ]
    },
    {
      role: snoogz?.role || 'DevOps Engineer',
      company: snoogz?.company || 'Snoogz Software',
      duration: snoogz?.duration || 'April 2025 - September 2025',
      bullets: [
        'Built and operated production infrastructure for a microservices platform with Docker, Kubernetes, Terraform, GitHub Actions, and Jenkins.',
        'Created Grafana dashboards, Prometheus metrics, distributed tracing, CI/CD workflows, and runbook-driven processes to improve reliability and incident response.'
      ]
    },
    {
      role: centurion?.role || 'Resident Manager',
      company: centurion?.company || 'Centurion Properties Associates',
      duration: centurion?.duration || 'March 2023 - February 2025',
      bullets: [
        'Managed day-to-day operations for a 120-unit residential building, including tenant relations, maintenance, vendors, inspections, and upkeep.',
        'Maintained rent collection, arrears follow-up, legal notices, suite turnovers, staff coordination, and organized lease/RTB documentation.'
      ]
    },
    {
      role: 'Resident Manager, Relief Manager, Assistant Manager',
      company: 'Hollyburn Properties Limited',
      duration: hollyburnRoles.length
        ? `${hollyburnRoles[hollyburnRoles.length - 1].duration.split(' - ')[0]} - ${hollyburnRoles[0].duration.split(' - ').pop()}`
        : 'April 2021 - February 2023',
      bullets: [
        'Managed operations across high-occupancy residential buildings, supporting maintenance teams, tenant service, contractor workflows, and renovations.',
        'Supported leasing, suite turnovers, move-in/out coordination, inspections, rent tracking, handover reports, and administrative documentation.'
      ]
    }
  ];
}

function getPdfCompetencies() {
  return [
    ['DevOps', 'Kubernetes, K3s, Docker, Docker Buildx, Helm, ArgoCD, Terraform, GitHub Actions, Jenkins, Linux, Bash'],
    ['Cloud & Observability', 'GCP, GCP Cloud Run, AWS, Prometheus, Grafana, kube-state-metrics, Node Exporter, Traefik'],
    ['Web & Backend', 'NGINX, Node.js, MongoDB, API gateways, admin tools, static sites, deployment workflows'],
    ['Property Operations', 'Leasing, tenant relations, RTA/MHPTA compliance, maintenance coordination, A/R and A/P, documentation']
  ];
}

function buildResumePdf(resumeData) {
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  const pages = [[]];
  let page = pages[0];
  let y = pageHeight - 38;

  function ensureSpace(height) {
    if (y - height >= 36) return;
    page = [];
    pages.push(page);
    y = pageHeight - 38;
  }

  function text(value, x, size, font = 'F1', options = {}) {
    const fill = options.fill || '0 0 0';
    page.push(`${fill} rg BT /${font} ${size} Tf ${x.toFixed(1)} ${y.toFixed(1)} Td (${escapePdfText(value)}) Tj ET`);
  }

  function textAt(value, x, textY, size, font = 'F1', options = {}) {
    const fill = options.fill || '0 0 0';
    page.push(`${fill} rg BT /${font} ${size} Tf ${x.toFixed(1)} ${textY.toFixed(1)} Td (${escapePdfText(value)}) Tj ET`);
  }

  function line(x1, y1, x2, y2, color = '0.72 0.72 0.72', width = 0.6) {
    page.push(`${color} RG ${width} w ${x1.toFixed(1)} ${y1.toFixed(1)} m ${x2.toFixed(1)} ${y2.toFixed(1)} l S`);
  }

  function centerText(value, textY, size, font = 'F1', options = {}) {
    const x = (pageWidth - estimateTextWidth(value, size)) / 2;
    textAt(value, x, textY, size, font, options);
  }

  function section(title, topGap = 12) {
    ensureSpace(28);
    y -= topGap;
    text(title.toUpperCase(), margin, 9.5, 'F2', { fill: '0 0 0' });
    line(margin, y - 4, pageWidth - margin, y - 4, '0.48 0.48 0.48', 0.5);
    y -= 14;
  }

  function paragraph(value, size = 8.4, lineHeight = 10.2) {
    const lines = wrapText(value, contentWidth, size);
    ensureSpace(lines.length * lineHeight + 4);
    lines.forEach((lineText) => {
      text(lineText, margin, size);
      y -= lineHeight;
    });
  }

  function bullet(value, indent = 11, fontSize = 8.2, lineHeight = 9.7) {
    const bulletX = margin + indent;
    const textX = bulletX + 11;
    const lines = wrapText(value, contentWidth - indent - 12, fontSize);
    ensureSpace(lines.length * lineHeight + 3);
    textAt('-', bulletX, y, fontSize, 'F2');
    lines.forEach((lineText, index) => {
      textAt(lineText, textX, y - index * lineHeight, fontSize);
    });
    y -= lines.length * lineHeight + 2;
  }

  const contact = uniqueValues([resumeData.phone, resumeData.email]).join(' | ');
  const subtitle = `${resumeData.title || 'DevOps Engineer'} | BC, Canada`;
  centerText(resumeData.name || 'John Hope Dawa', y, 18, 'F2');
  y -= 14;
  centerText(subtitle, y, 10, 'F1');
  y -= 11;
  centerText(contact, y, 8.8, 'F1');
  y -= 9;

  section('Professional Summary', 14);
  paragraph(resumeData.summary || 'DevOps engineer and operations professional with experience supporting cloud infrastructure, production-style HomeLab deployments, residential portfolios, vendor coordination, documentation, scheduling, tenant communications, and digital systems management.', 8.4, 10.3);

  section('Professional Experience', 12);
  getPdfExperience(resumeData).forEach((job) => {
    const jobLine = `${job.role} - ${job.company} - ${job.duration}`;
    ensureSpace(22 + job.bullets.length * 18);
    text(jobLine, margin, 8.9, 'F2');
    y -= 11;
    job.bullets.forEach((item) => bullet(item));
    y -= 3;
  });

  section('Core Competencies', 12);
  getPdfCompetencies().forEach(([label, value]) => {
    const lines = wrapText(`${label}: ${value}`, contentWidth, 8.1);
    ensureSpace(lines.length * 9.4 + 2);
    lines.forEach((lineText, index) => {
      textAt(lineText, index === 0 ? margin : margin + 16, y, 8.1, 'F1');
      y -= 9.4;
    });
  });

  return createPdfDocument(pages.slice(0, 1));
}

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'resume-api' });
});

// Resume endpoint (no /api prefix - that's handled by gateway)
app.get('/resume', async (_req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('resume');
    const resumeData = await collection.findOne({});

    if (!resumeData) {
      return res.status(404).json({ error: 'Resume data not found' });
    }

    res.json(resumeData);
  } catch (error) {
    console.error('Resume API: Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume data' });
  }
});

app.get('/resume/pdf', async (_req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('resume');
    const resumeData = await collection.findOne({});

    if (!resumeData) {
      return res.status(404).json({ error: 'Resume data not found' });
    }

    const pdf = buildResumePdf(resumeData);
    const filename = resumeData.download?.filename || PDF_FILENAME;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdf.length);
    res.send(pdf);
  } catch (error) {
    console.error('Resume API: Error generating resume PDF:', error);
    res.status(500).json({ error: 'Failed to generate resume PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`Resume API running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  - GET /health');
  console.log('  - GET /resume');
  console.log('  - GET /resume/pdf');
});
