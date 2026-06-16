'use server';

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function parseCSV(csv: string) {
  const [header, ...rows] = csv.trim().split('\n');
  const keys = header.trim().split(',');
  return rows
    .filter(r => r.trim())
    .map(r => Object.fromEntries(
      r.trim().split(',').map((v, i) => [keys[i], v.trim()])
    ));
}

export async function getProducerData(producerId: string) {
  console.log('[getProducerData] producerId:', producerId);
  console.log('[getProducerData] DATA_DIR:', DATA_DIR);

  try {
    const projectsRaw = fs.readFileSync(path.join(DATA_DIR, 'projects.csv'), 'utf-8');
    const assignmentsRaw = fs.readFileSync(path.join(DATA_DIR, 'assignments.csv'), 'utf-8');

    const allProjects = parseCSV(projectsRaw);
    const allAssignments = parseCSV(assignmentsRaw);

    console.log('[getProducerData] all projects:', allProjects);
    console.log('[getProducerData] all assignments:', allAssignments);

    const projects = allProjects.filter(p => p.producerid === producerId);
    const assignments = allAssignments.filter(a => a.producerid === producerId);

    console.log('[getProducerData] filtered projects:', projects);
    console.log('[getProducerData] filtered assignments:', assignments);

    return { projects, assignments };
  } catch (err) {
    console.error('[getProducerData] ERROR:', err);
    return { projects: [], assignments: [] };
  }
}

export async function saveAssignmentStatus(id: string, status: string) {
  console.log('[saveAssignmentStatus] id:', id, 'status:', status);

  try {
    const filePath = path.join(DATA_DIR, 'assignments.csv');
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log('[saveAssignmentStatus] current file content:', content);

    const lines = content.trim().split('\n');
    const updated = lines.map((line, i) => {
      if (i === 0) return line.trim();
      const cols = line.trim().split(',');
      if (cols[0] === id) {
        cols[4] = status;
        return cols.join(',');
      }
      return line.trim();
    });

    const newContent = updated.join('\n') + '\n';
    console.log('[saveAssignmentStatus] writing:', newContent);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log('[saveAssignmentStatus] done');
  } catch (err) {
    console.error('[saveAssignmentStatus] ERROR:', err);
  }
}