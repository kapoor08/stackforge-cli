import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { doctorCommand } from '../src/cli/commands/doctor.js';
import { STACKFORGE_SCHEMA_VERSION } from '../src/utils/schema.js';

const tempRoot = join(process.cwd(), 'tmp-doctor');
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const projectRoot = join(tempRoot, 'doctor-app');
await mkdir(projectRoot, { recursive: true });
await writeFile(
  join(projectRoot, 'stackforge.json'),
  JSON.stringify({ projectName: 'doctor-app', _schemaVersion: STACKFORGE_SCHEMA_VERSION })
);
await writeFile(join(projectRoot, 'package.json'), JSON.stringify({ name: 'doctor-app' }));

process.chdir(projectRoot);
await doctorCommand.parseAsync(['node', 'doctor']);

console.log('doctor test passed');