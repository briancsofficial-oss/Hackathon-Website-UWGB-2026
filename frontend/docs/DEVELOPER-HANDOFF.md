# Developer Handoff

## Current working elements
- Next.js App Router + TypeScript
- Tailwind CSS v4 styling
- Cream-and-black responsive layout
- Local shadcn/ui-compatible Button, Card, Input, and Textarea components
- `components.json` configured for shadcn CLI conventions
- Recharts area chart with illustrative sample data
- OpenAI server route at `app/api/insights/route.ts`, with demo fallback if no API key is configured
- Six-phase onboarding and manual data entry
- File picker lists filenames only; no upload occurs

## shadcn.io note
Shadcn.io is a component and design resource, not a core framework/runtime package. This project uses the requested style direction and shadcn-compatible components/configuration. A developer can selectively port specific shadcn.io components after reviewing their code and licenses/usage requirements.

## Next engineering tasks
1. Add Zod schemas and robust validation.
2. Add authentication, database schema, tenant isolation, and persistent server-side saves.
3. Implement secure file upload, file size/type limits, malware scanning, private object storage, extraction and user confirmation.
4. Define and test financial metric formulas; label source, date range, and confidence.
5. Replace demo chart series with real saved data.
6. Add rate limiting, authorization, logging safeguards, and error handling to the OpenAI route.
7. Add tests, accessibility review, deployment workflow, backups, and security review.
8. Add Plaid later with explicit consent and secure token lifecycle.

## Security
Do not expose API keys in client code. Do not send sensitive business data to AI services without clear user consent. This prototype is not ready for real customer financial data.
