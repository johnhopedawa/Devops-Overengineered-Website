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

function compactExperienceForPdf(experience = []) {
  const compacted = [];

  experience.forEach((job) => {
    const previous = compacted[compacted.length - 1];
    if (previous && previous.company === job.company) {
      previous.roles.push({ role: job.role, duration: job.duration });
      previous.role = uniqueValues(previous.roles.map((item) => item.role)).join(' / ');
      previous.duration = `${job.duration.split(' - ')[0]} - ${previous.duration.split(' - ').pop()}`;
      previous.responsibilities = uniqueValues([
        ...previous.responsibilities,
        ...(job.responsibilities || [])
      ]);
      return;
    }

    compacted.push({
      ...job,
      roles: [{ role: job.role, duration: job.duration }],
      responsibilities: [...(job.responsibilities || [])]
    });
  });

  return compacted;
}

function shortenBullet(text, maxLength = 132) {
  const normalized = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;

  const trimmed = normalized.slice(0, maxLength - 1);
  const lastSpace = trimmed.lastIndexOf(' ');
  return `${trimmed.slice(0, lastSpace > 80 ? lastSpace : trimmed.length).replace(/[,.]$/, '')}.`;
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

function buildResumePdf(resumeData) {
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 38;
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

  function section(title) {
    ensureSpace(28);
    y -= 10;
    text(title.toUpperCase(), margin, 9, 'F2', { fill: '0.02 0.25 0.22' });
    line(margin, y - 4, pageWidth - margin, y - 4);
    y -= 16;
  }

  function paragraph(value, size = 8.5, lineHeight = 10.5) {
    const lines = wrapText(value, contentWidth, size);
    ensureSpace(lines.length * lineHeight + 4);
    lines.forEach((lineText) => {
      text(lineText, margin, size);
      y -= lineHeight;
    });
  }

  function bullet(value, indent = 10) {
    const fontSize = 8;
    const lineHeight = 9.5;
    const bulletX = margin + indent;
    const textX = bulletX + 10;
    const lines = wrapText(shortenBullet(value), contentWidth - indent - 12, fontSize);
    ensureSpace(lines.length * lineHeight + 2);
    textAt('-', bulletX, y, fontSize, 'F2');
    lines.forEach((lineText, index) => {
      textAt(lineText, textX, y - index * lineHeight, fontSize);
    });
    y -= lines.length * lineHeight + 1.5;
  }

  function rightText(value, size = 8) {
    const x = pageWidth - margin - estimateTextWidth(value, size);
    textAt(value, x, y, size, 'F1');
  }

  text(resumeData.name || 'John Hope Dawa', margin, 18, 'F2', { fill: '0.02 0.08 0.16' });
  y -= 14;
  text(resumeData.title || 'DevOps Engineer', margin, 10, 'F2', { fill: '0.02 0.25 0.22' });
  y -= 11;
  paragraph(uniqueValues([resumeData.location, resumeData.email, resumeData.phone]).join(' | '), 8, 9.5);

  section('Profile');
  paragraph('DevOps Engineer focused on Kubernetes, CI/CD, Terraform, observability, and cloud infrastructure, with a strong operations background and clear cross-functional communication.', 8.5, 10);

  section('Skills');
  paragraph((resumeData.skills || []).slice(0, 18).join(' | '), 8.2, 9.8);

  section('Experience');
  const bulletLimits = [3, 2, 3, 2, 2];
  compactExperienceForPdf(resumeData.experience || []).forEach((job, index) => {
    const responsibilities = (job.responsibilities || []).slice(0, bulletLimits[index] || 1);
    const roleLine = `${job.role} - ${job.company}`;
    const rolesLine = job.roles && job.roles.length > 1
      ? job.roles.map((item) => `${item.role} (${item.duration})`).join('; ')
      : '';
    const metaLines = wrapText(`${job.location || ''}${rolesLine ? ` | ${rolesLine}` : ''}`, contentWidth, 7.8);
    const needed = 22 + metaLines.length * 9.5 + responsibilities.length * 18;

    ensureSpace(needed);
    text(roleLine, margin, 9, 'F2', { fill: '0.02 0.08 0.16' });
    rightText(job.duration, 8);
    y -= 10;
    metaLines.forEach((metaLine) => {
      text(metaLine, margin, 7.8, 'F1', { fill: '0.28 0.28 0.28' });
      y -= 9.5;
    });
    responsibilities.forEach((item) => bullet(item));
    y -= 3;
  });

  section('Interests');
  paragraph((resumeData.interests || []).join(' | '), 8.2, 9.5);

  return createPdfDocument(pages.slice(0, 2));
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
