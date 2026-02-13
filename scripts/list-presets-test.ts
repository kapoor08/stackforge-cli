import { listPresetsCommand } from '../src/cli/commands/list-presets.js';

await listPresetsCommand.parseAsync(['node', 'list-presets']);

console.log('list-presets test passed');