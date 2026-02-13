import { listPresetsCommand } from '../src/cli/commands/list-presets.js';

await listPresetsCommand.parseAsync(['node', 'list-presets', '--details']);

console.log('list-presets details test passed');