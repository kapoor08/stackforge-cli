---
"create-stackforge": patch
---

Fix 30 audit issues across security, generators, CLI commands, validators, utilities, and AI agent config

- Fix command injection in npm-registry.ts (exec → execFile)
- Fix MCP server broken newlines in config-generator.ts
- Fix API/Auth route templates to respect language setting
- Fix doctor.ts Promise.reject crash and accept cwd parameter
- Add error handling (try-catch) to add, remove, list, update, migrate commands
- Read CLI version from package.json dynamically
- Add Mongoose compatibility validation
- Remove duplicate validation checks in config.ts
- Add windsurf and tabnine to doctor agent file checks
- Fix env key removal to preserve formatting and match exact keys
- Validate feature parsing rejects invalid formats
- Export and use presetNames instead of hardcoded list
- Remove unused import and fix type casts (as any → proper types)
- Remove duplicate Gemini file write
- Create nextauth-route.js template for JavaScript projects
